export const sub = (b, a) => [b[0] - a[0], b[1] - a[1]];

export const len2 = (a) => a[0] * a[0] + a[1] * a[1];
export const len = (a) => Math.sqrt(len2(a));
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
export const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
export const rotateVec = (vec, angle) => {
  let cos = Math.cos(angle);
  let sin = Math.sin(angle);
  return [vec[0] * cos - vec[1] * sin, vec[0] * sin + vec[1] * cos];
};
export const tanCalc = (p, a, b) => {
  const ab = sub(b, a);
  const ap = sub(p, a);
  const len = len2(ab);
  const dotVal = dot(ap, ab);
  const t = dotVal / len;
  const point = [a[0] + ab[0] * t, a[1] + ab[1] * t];

  return { len, dotVal, t, point };
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
