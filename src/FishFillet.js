import React from "react";
import Draggable from "react-draggable";
import ContainerDimensions from "react-container-dimensions";

class FishFillet extends React.Component {
  state = {
    lineA: [[300, 200], [220, 50]],
    lineB: [[400, 100], [200, 100]],
    tanLineA: [[0, 0], [0, 0]],
    intersectionPoint: null,
    circleCenter: null,
    closePointA: null,
    closePointB: null,
    mousePoint: null,
    radius: 25
  };

  componentDidMount() {
    this._findIntersection();
    this._mouseMove = document.addEventListener("mousemove", this._handleMove);
  }

  componentWillUnmount() {
    document.removeEventListener("mousemove", this._mouseMove);
  }

  _handleMove = ev => {
    const mousePoint = [ev.clientX, ev.clientY];
    this.setState({ mousePoint });
    this._findIntersection();
  };

  _onDrag = (point, propName, pointIndex) => {
    const oldLine = this.state[propName].slice();
    oldLine[pointIndex] = point;
    this.setState({ [propName]: oldLine });
  };

  _findIntersection() {
    const { lineA, lineB, mousePoint, radius } = this.state;

    if (mousePoint) {
      const tanCalc = (p, a, b) => {
        const vecAB = [b[0] - a[0], b[1] - a[1]];
        const vecAP = [p[0] - a[0], p[1] - a[1]];
        const len = vecAB[0] * vecAB[0] + vecAB[1] * vecAB[1];
        const dot = vecAP[0] * vecAB[0] + vecAP[1] * vecAB[1];
        const t = dot / len;
        const point = [a[0] + vecAB[0] * t, a[1] + vecAB[1] * t];

        return { len, dot, t, point };
      };

      const { point: closePointA } = tanCalc(mousePoint, lineA[0], lineA[1]);
      const { point: closePointB } = tanCalc(mousePoint, lineB[0], lineB[1]);

      // this.setState({ closePointA, closePointB });
    }

    // (x1, y1)-(x2, y2) and (x3, y3)-(x4, y4).
    const intersection = checkIntersection(
      lineA[0][0],
      lineA[0][1],
      lineA[1][0],
      lineA[1][1],
      lineB[0][0],
      lineB[0][1],
      lineB[1][0],
      lineB[1][1]
    );

    let intersectionPoint;
    if (intersection.type === "intersecting") {
      intersectionPoint = [intersection.point.x, intersection.point.y];

      const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
      const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
      const rotateVec = (vec, angle) => {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        return [vec[0] * cos - vec[1] * sin, vec[0] * sin + vec[1] * cos];
      };

      const [pA0, pA1] = lineA;
      const [pB0, pB1] = lineB;
      const vecA = [
        pA1[0] - intersectionPoint[0],
        pA1[1] - intersectionPoint[1]
      ];
      const vecB = [
        pB1[0] - intersectionPoint[0],
        pB1[1] - intersectionPoint[1]
      ];
      const crossVal = cross(vecA, vecB);
      const dotVal = dot(vecA, vecB);
      const angle = Math.atan2(crossVal, dotVal);
      const s = radius / Math.sin(angle / 2);

      const lenA = Math.sqrt(vecA[0] * vecA[0] + vecA[1] * vecA[1]);
      const unitA = [vecA[0] / lenA, vecA[1] / lenA];
      const alongA = [unitA[0] * s, unitA[1] * s];
      const rotated = rotateVec(alongA, angle / 2);
      const circleCenter = [
        rotated[0] + intersectionPoint[0],
        rotated[1] + intersectionPoint[1]
      ];

      this.setState({ intersectionPoint, circleCenter });

      // const unitVecA = )=(𝑥cos𝜃−𝑦sin𝜃,𝑥sin𝜃+𝑦cos𝜃)
      console.log(`angle`, (angle * 180) / Math.PI);
      // Math.Atan2(Cross(A,B), Dot(A,B));
    }

    this.setState({ intersectionPoint });
  }

  _renderSvg({ width, height }) {
    return (
      <svg
        version="1.1"
        baseProfile="full"
        width={width}
        height={height}
        viewport={`${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>{this._renderLines()}</g>
      </svg>
    );
  }

  _renderLines() {
    const {
      lineA,
      lineB,
      intersectionPoint,
      mousePoint,
      closePointA,
      circleCenter,
      closePointB,
      radius
    } = this.state;
    return (
      <g>
        {circleCenter && (
          <>
            <circle
              cx={circleCenter[0]}
              cy={circleCenter[1]}
              r={radius}
              stroke="white"
              strokeWidth={4}
              fill={"none"}
              style={{ pointerEvents: "none" }}
            />
          </>
        )}
        {closePointA && (
          <>
            {false && mousePoint && (
              <line
                x1={closePointA[0]}
                y1={closePointA[1]}
                x2={mousePoint[0]}
                y2={mousePoint[1]}
                stroke={"darkred"}
                strokeWidth={2}
                strokeLinecap={"round"}
              />
            )}
            <circle
              cx={closePointA[0]}
              cy={closePointA[1]}
              r="6"
              stroke="none"
              fill={"darkred"}
              style={{ pointerEvents: "none" }}
            />
          </>
        )}
        {closePointB && (
          <>
            {false && mousePoint && (
              <line
                x1={closePointB[0]}
                y1={closePointB[1]}
                x2={mousePoint[0]}
                y2={mousePoint[1]}
                stroke={"darkblue"}
                strokeWidth={2}
                strokeLinecap={"round"}
              />
            )}
            <circle
              cx={closePointB[0]}
              cy={closePointB[1]}
              r="6"
              stroke="none"
              fill={"darkblue"}
              style={{ pointerEvents: "none" }}
            />
          </>
        )}
        {this._renderLine(lineA, "lineA", "red")}
        {this._renderLine(lineB, "lineB", "blue")}
        {intersectionPoint && (
          <>
            <circle
              cx={intersectionPoint[0]}
              cy={intersectionPoint[1]}
              r="6"
              stroke="none"
              fill={"yellow"}
              style={{ pointerEvents: "none" }}
            />
          </>
        )}
        {false && mousePoint && (
          <circle
            cx={mousePoint[0]}
            cy={mousePoint[1]}
            r="1"
            stroke="none"
            fill={"black"}
          />
        )}
      </g>
    );
  }
  _renderLine(line, linePropName, color) {
    const [pointA, pointB] = line;
    const [x1, y1] = pointA;
    const [x2, y2] = pointB;
    return (
      <g>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={color}
          strokeWidth={4}
          strokeLinecap={"round"}
        />
        <Draggable
          defaultPosition={{ x: x1, y: y1 }}
          position={{ x: x1, y: y1 }}
          onDrag={(_, { x, y }) => this._onDrag([x, y], linePropName, 0)}
        >
          <circle cx={0} cy={0} r="8" stroke="none" fill={color} />
        </Draggable>
        <Draggable
          defaultPosition={{ x: x2, y: y2 }}
          position={{ x: x2, y: y2 }}
          onDrag={(_, { x, y }) => this._onDrag([x, y], linePropName, 1)}
        >
          <circle cx={0} cy={0} r="4" stroke="none" fill={color} />
        </Draggable>
      </g>
    );
  }

  render() {
    return (
      <div
        className="root"
        style={{
          height: "100%",
          background: "grey",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%"
        }}
      >
        <ContainerDimensions>
          {({ width, height }) => this._renderSvg({ width, height })}
        </ContainerDimensions>
      </div>
    );
  }
}

const COLINEAR = intersectResult("colinear");
const PARALLEL = intersectResult("parallel");
const NONE = intersectResult("none");

// (x1, y1)-(x2, y2) and (x3, y3)-(x4, y4).
export function checkIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  const numeA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
  const numeB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);

  if (denom == 0) {
    if (numeA == 0 && numeB == 0) {
      return COLINEAR;
    }
    return PARALLEL;
  }

  const uA = numeA / denom;
  const uB = numeB / denom;

  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
    return intersecting({
      x: x1 + uA * (x2 - x1),
      y: y1 + uA * (y2 - y1)
    });
  }

  return NONE;
}

function intersecting(point) {
  const result = intersectResult("intersecting");
  result.point = point;
  return result;
}

function intersectResult(type) {
  return {
    type
  };
}

export default FishFillet;
