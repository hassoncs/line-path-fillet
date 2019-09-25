export const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
export const len2 = (a) => a[0] * a[0] + a[1] * a[1];
export const len = (a) => Math.sqrt(len2(a));
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
export const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
export const rotateVec = (vec, angle) => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [vec[0] * cos - vec[1] * sin, vec[0] * sin + vec[1] * cos];
};
export const closestPointOnLine = (p, a, b) => {
  const ab = sub(b, a);
  const ap = sub(p, a);
  const len = len2(ab);
  const dotVal = dot(ap, ab);
  const t = dotVal / len;
  const point = [a[0] + ab[0] * t, a[1] + ab[1] * t];
  return point;
};

export const NONE = { type: 'none' };
export function checkIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  const numeA = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
  // const numeB = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);

  if (denom == 0) {
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

export function filletCorner(pa, pb, pc, requestedRadius) {
  const vecA = sub(pa, pb);
  const vecB = sub(pc, pb);
  const crossVal = cross(vecA, vecB);
  const dotVal = dot(vecA, vecB);
  const angle = Math.atan2(crossVal, dotVal);
  const halfAngle = angle / 2;

  const [lenA, lenB] = [len(vecA), len(vecB)];
  const tan = Math.tan(halfAngle);
  const radius = Math.min(
    requestedRadius,
    Math.abs(tan * lenA),
    Math.abs(tan * lenB),
  );
  const s = radius / Math.sin(halfAngle);
  const unitA = [vecA[0] / lenA, vecA[1] / lenA];
  const alongA = [unitA[0] * s, unitA[1] * s];

  const rotated = rotateVec(alongA, halfAngle - Math.PI);
  const circleCenter = [rotated[0] + pb[0], rotated[1] + pb[1]];

  const tanPointA = closestPointOnLine(circleCenter, pa, pb);
  const tanPointB = closestPointOnLine(circleCenter, pc, pb);

  const offset = -90;
  const angleA =
    (Math.atan2(
      tanPointA[1] - circleCenter[1],
      tanPointA[0] - circleCenter[0],
    ) *
      180) /
      Math.PI -
    offset;
  const angleB =
    (Math.atan2(
      tanPointB[1] - circleCenter[1],
      tanPointB[0] - circleCenter[0],
    ) *
      180) /
      Math.PI -
    offset;

  return {
    radius,
    angleA,
    angleB,
    tanPointA,
    tanPointB,
    circleCenter,
  };
}
