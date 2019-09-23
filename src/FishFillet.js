import React from "react";
import Draggable from "react-draggable";
import ContainerDimensions from "react-container-dimensions";

class FishFillet extends React.Component {
  state = {
    lineA: [[100, 100], [300, 200]],
    lineB: [[200, 100], [400, 100]]
  };

  _onDrag = (point, propName, pointIndex) => {
    const oldLine = this.state[propName].slice();
    oldLine[pointIndex] = point;
    this.setState({ [propName]: oldLine }, () => {
      this._findIntersection();
    });
  };

  _findIntersection() {
    const { lineA, lineB } = this.state;
    const [p_a1, p_a2] = lineA;
    const [p_b1, p_b2] = lineB;
    const [a1_x, a1_y] = p_a1;
    const [a2_x, a2_y] = p_a2;
    const [b1_x, b1_y] = p_b1;
    const [b2_x, b2_y] = p_b2;

    const m_a = (a2_y - a1_y) / (a2_x - a1_x);
    const m_b = (b2_y - b1_y) / (b2_x - b1_x);
    const b_a = a1_y + (-a2_y * a1_x + a1_y * a1_x) / (a2_x - a1_x);
    const b_b = b1_y + (-b2_y * b1_x + b1_y * b1_x) / (b2_x - b1_x);

    const x = (b_b - b_a) / (m_a - m_b);
    const y = m_a * x + b_a;

    const intersectionPoint = [x, y];
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
    const { lineA, lineB, intersectionPoint } = this.state;
    return (
      <g>
        {this._renderLine(lineA, "lineA", "blue")}
        {this._renderLine(lineB, "lineB", "red")}
        {intersectionPoint && (
          <>
            <circle
              cx={intersectionPoint[0]}
              cy={intersectionPoint[1]}
              r="6"
              stroke="none"
              fill={"yellow"}
            />
          </>
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
          onDrag={ev => this._onDrag([ev.clientX, ev.clientY], linePropName, 0)}
        >
          <circle cx={0} cy={0} r="6" stroke="none" fill={color} />
        </Draggable>
        <Draggable
          defaultPosition={{ x: x2, y: y2 }}
          position={{ x: x2, y: y2 }}
          onDrag={ev => this._onDrag([ev.clientX, ev.clientY], linePropName, 1)}
        >
          <circle cx={0} cy={0} r="6" stroke="none" fill={color} />
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

export default FishFillet;
