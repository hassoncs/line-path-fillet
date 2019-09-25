import React from 'react';
import Draggable from 'react-draggable';
import ContainerDimensions from 'react-container-dimensions';
import { filletCorner, getIntersection } from './fillet-math';
import { describeArc } from './svg-helpers';

class ExampleDemoApp extends React.Component {
  state = {
    lineA: [[300, 200], [220, 50]],
    lineB: [[400, 100], [200, 100]],
    tanLineA: [[0, 0], [0, 0]],
    intersectionPoint: null,
    circleCenter: null,
    closePointA: null,
    closePointB: null,
    mousePoint: null,
    radius: 50,
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
    const intersectionPoint = getIntersection(
      lineA[0][0],
      lineA[0][1],
      lineA[1][0],
      lineA[1][1],
      lineB[0][0],
      lineB[0][1],
      lineB[1][0],
      lineB[1][1],
    );
    if (!intersectionPoint) return;

    const filletData = filletCorner(
      lineA[0],
      intersectionPoint,
      lineB[0],
      radius,
    );
    const {
      radius: usedRadius,
      angleA,
      angleB,
      tanPointA,
      tanPointB,
      circleCenter,
    } = filletData;

    const arc = describeArc(
      circleCenter[0],
      circleCenter[1],
      usedRadius,
      angleA,
      angleB,
    );

    this.setState({
      closePointA: tanPointA,
      closePointB: tanPointB,
      usedRadius,
      arc,
      intersectionPoint: intersectionPoint,
      circleCenter,
    });
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
            {closePointA && (
              <line
                x1={lineA[0][0]}
                y1={lineA[0][1]}
                x2={closePointA[0]}
                y2={closePointA[1]}
                stroke={'white'}
                strokeWidth={6}
                strokeLinecap={'round'}
              />
            )}
            {closePointB && (
              <line
                x1={lineB[0][0]}
                y1={lineB[0][1]}
                x2={closePointB[0]}
                y2={closePointB[1]}
                stroke={'white'}
                strokeWidth={6}
                strokeLinecap={'round'}
              />
            )}
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

export default ExampleDemoApp;
