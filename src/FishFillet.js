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
    radius: 160,
    usedRadius: 0
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

      const [pA0, pA1] = lineA;
      const [pB0, pB1] = lineB;
      const vecA = [
        pA0[0] - intersectionPoint[0],
        pA0[1] - intersectionPoint[1]
      ];
      const vecB = [
        pB0[0] - intersectionPoint[0],
        pB0[1] - intersectionPoint[1]
      ];
      const crossVal = cross(vecA, vecB);
      const dotVal = dot(vecA, vecB);
      const angle = Math.atan2(crossVal, dotVal);

      const lenA = Math.sqrt(vecA[0] * vecA[0] + vecA[1] * vecA[1]);
      const lenB = Math.sqrt(vecB[0] * vecB[0] + vecB[1] * vecB[1]);
      const tanAngle = Math.tan(angle / 2);
      const usedRadius = Math.min(
        radius,
        Math.abs(tanAngle * lenA),
        Math.abs(tanAngle * lenB)
      );
      const s = usedRadius / Math.sin(angle / 2);

      const unitA = [vecA[0] / lenA, vecA[1] / lenA];
      const alongA = [unitA[0] * s, unitA[1] * s];

      const rotated = rotateVec(alongA, angle / 2 - Math.PI);
      const circleCenter = [
        rotated[0] + intersectionPoint[0],
        rotated[1] + intersectionPoint[1]
      ];

      const { point: closePointA, t: tA } = tanCalc(
        circleCenter,
        lineA[0],
        lineA[1]
      );
      const { point: closePointB, t: tB } = tanCalc(
        circleCenter,
        lineB[0],
        lineB[1]
      );

      this.setState({ closePointA, closePointB, usedRadius });
      this.setState({ intersectionPoint, circleCenter });
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
      radius,
      usedRadius
    } = this.state;
    return (
      <g>
        {circleCenter && (
          <>
            <circle
              cx={circleCenter[0]}
              cy={circleCenter[1]}
              r={usedRadius || radius}
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
              fill={"purple"}
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

const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
const rotateVec = (vec, angle) => {
  let cos = Math.cos(angle);
  let sin = Math.sin(angle);
  return [vec[0] * cos - vec[1] * sin, vec[0] * sin + vec[1] * cos];
};
const tanCalc = (p, a, b) => {
  const vecAB = [b[0] - a[0], b[1] - a[1]];
  const vecAP = [p[0] - a[0], p[1] - a[1]];
  const len = vecAB[0] * vecAB[0] + vecAB[1] * vecAB[1];
  const dot = vecAP[0] * vecAB[0] + vecAP[1] * vecAB[1];
  const t = dot / len;
  const point = [a[0] + vecAB[0] * t, a[1] + vecAB[1] * t];

  return { len, dot, t, point };
};

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

// from https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){

  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);

  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  var d = [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");

  return d;
}

export default FishFillet;
