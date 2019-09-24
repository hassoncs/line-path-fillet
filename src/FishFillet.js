import React from 'react';
import Draggable from 'react-draggable';
import ContainerDimensions from 'react-container-dimensions';
import { checkIntersection } from './fillet-math';
import { cross } from './fillet-math';
import { dot } from './fillet-math';
import { rotateVec } from './fillet-math';
import { tanCalc } from './fillet-math';
import { describeArc } from './svg-helpers';
import { len } from './fillet-math';

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
    radius: 30,
    usedRadius: 0,
  };

  componentDidMount() {
    this._findIntersection();
    this._mouseMove = document.addEventListener('mousemove', this._handleMove);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this._mouseMove);
  }

  _handleMove = (ev) => {
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
    const { lineA, lineB, radius } = this.state;
    const intersection = checkIntersection(
      lineA[0][0],
      lineA[0][1],
      lineA[1][0],
      lineA[1][1],
      lineB[0][0],
      lineB[0][1],
      lineB[1][0],
      lineB[1][1],
    );

    let pIntersection;
    if (intersection.type !== 'intersecting') {
      return;
    }

    pIntersection = [intersection.point[0], intersection.point[1]];

    const [pA0, pA1] = lineA;
    const [pB0, pB1] = lineB;
    const vecA = [pA0[0] - pIntersection[0], pA0[1] - pIntersection[1]];
    const vecB = [pB0[0] - pIntersection[0], pB0[1] - pIntersection[1]];
    const crossVal = cross(vecA, vecB);
    const dotVal = dot(vecA, vecB);
    const angle = Math.atan2(crossVal, dotVal);

    const [lenA, lenB] = [len(vecA), len(vecB)];
    const tan = Math.tan(angle / 2);
    const usedRadius = Math.min(
      radius,
      Math.abs(tan * lenA),
      Math.abs(tan * lenB),
    );
    const s = usedRadius / Math.sin(angle / 2);
    const unitA = [vecA[0] / lenA, vecA[1] / lenA];
    const alongA = [unitA[0] * s, unitA[1] * s];

    const rotated = rotateVec(alongA, angle / 2 - Math.PI);
    const circleCenter = [
      rotated[0] + pIntersection[0],
      rotated[1] + pIntersection[1],
    ];

    const { point: closePointA, t: tA } = tanCalc(
      circleCenter,
      lineA[0],
      lineA[1],
    );
    const { point: closePointB, t: tB } = tanCalc(
      circleCenter,
      lineB[0],
      lineB[1],
    );

    const offset = -90;
    const angleA =
      (Math.atan2(
        closePointA[1] - circleCenter[1],
        closePointA[0] - circleCenter[0],
      ) *
        180) /
      Math.PI;
    const angleB =
      (Math.atan2(
        closePointB[1] - circleCenter[1],
        closePointB[0] - circleCenter[0],
      ) *
        180) /
      Math.PI;
    const arc = describeArc(
      circleCenter[0],
      circleCenter[1],
      usedRadius,
      angleA - offset,
      angleB - offset,
    );

    this.setState({ closePointA, closePointB, usedRadius, arc });
    this.setState({ intersectionPoint: pIntersection, circleCenter });
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
      usedRadius,
      arc,
    } = this.state;
    return (
      <g>
        {circleCenter && (
          <>
            <circle
              cx={circleCenter[0]}
              cy={circleCenter[1]}
              r={usedRadius || radius}
              stroke="lightgrey"
              strokeWidth={4}
              fill={'none'}
              strokeOpacity={0.1}
              style={{ pointerEvents: 'none' }}
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
                stroke={'darkred'}
                strokeWidth={2}
                strokeLinecap={'round'}
              />
            )}
            <circle
              cx={closePointA[0]}
              cy={closePointA[1]}
              r="6"
              stroke="none"
              fill={'darkred'}
              style={{ pointerEvents: 'none' }}
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
                stroke={'darkblue'}
                strokeWidth={2}
                strokeLinecap={'round'}
              />
            )}
            <circle
              cx={closePointB[0]}
              cy={closePointB[1]}
              r="6"
              stroke="none"
              fill={'darkblue'}
              style={{ pointerEvents: 'none' }}
            />
          </>
        )}
        {arc && (
          <>
            <line
              x1={lineA[0][0]}
              y1={lineA[0][1]}
              x2={closePointA[0]}
              y2={closePointA[1]}
              stroke={'white'}
              strokeWidth={6}
              strokeLinecap={'round'}
            />
            <line
              x1={lineB[0][0]}
              y1={lineB[0][1]}
              x2={closePointB[0]}
              y2={closePointB[1]}
              stroke={'white'}
              strokeWidth={6}
              strokeLinecap={'round'}
            />
            <path d={arc} stroke={'white'} strokeWidth={6} fill={'none'} />
          </>
        )}
        {this._renderLine(lineA, 'lineA', 'red')}
        {this._renderLine(lineB, 'lineB', 'blue')}
        {intersectionPoint && (
          <>
            <circle
              cx={intersectionPoint[0]}
              cy={intersectionPoint[1]}
              r="6"
              stroke="none"
              fill={'purple'}
              strokeOpacity={0.1}
              style={{ pointerEvents: 'none' }}
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
          strokeOpacity={0.1}
          strokeLinecap={'round'}
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
          height: '100%',
          background: 'grey',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
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
