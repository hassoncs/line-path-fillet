export const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
export const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
export const rotateVec = (vec, angle) => {
  let cos = Math.cos(angle);
  let sin = Math.sin(angle);
  return [vec[0] * cos - vec[1] * sin, vec[0] * sin + vec[1] * cos];
};
export const tanCalc = (p, a, b) => {
  const vecAB = [b[0] - a[0], b[1] - a[1]];
  const vecAP = [p[0] - a[0], p[1] - a[1]];
  const len = vecAB[0] * vecAB[0] + vecAB[1] * vecAB[1];
  const dot = vecAP[0] * vecAB[0] + vecAP[1] * vecAB[1];
  const t = dot / len;
  const point = [a[0] + vecAB[0] * t, a[1] + vecAB[1] * t];

  return { len, dot, t, point };
};

export const NONE = { type: 'none' };

export function checkIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  const numeA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
  const numeB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);

  if (denom == 0) {
    if (numeA == 0 && numeB == 0) {
      return NONE;
    }
    return NONE;
  }

  const uA = numeA / denom;
  // const withinSegments = (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1)
  const point = [x1 + uA * (x2 - x1), y1 + uA * (y2 - y1)];
  return {
    type: 'intersecting',
    point,
  };
}

// from https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle

export function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

export function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  const d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(' ');

  return d;
}
