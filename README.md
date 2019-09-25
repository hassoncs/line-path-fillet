A line path filleting micro-library

## Demo
Check it out in action:
https://hassoncs.github.io/line-path-fillet/

## Purpose

This library's primary purpose is to fillet (round) the corner between two line segments. 


If the line segments are too small to form a fillet arc at the requested radius, the 
largest possible radius will be used.

## Use

```.js

// With four points, A, B, C, and D specified as x,y arrays of length 2:

const pointA = [0, 0];
const pointB = [0, 0];
const pointC = [0, 0];
const pointD = [0, 0];

// First we find the intersection point of the line segments
// This will project the lines as needed in order to find 
// the first possible intersection point.
// It will return null if the lines will never intersect.
const intersectionPoint = findIntersection(
  pointA[0],
  pointA[1],
  pointB[0],
  pointB[1],
  pointC[0],
  pointC[1],
  pointD[0],
  pointD[1],
);
if (!intersectionPoint) return;

const radius = 100;
const filletData = filletCorner(
  pointA,
  intersectionPoint,
  pointC,
  radius,
);

// Now we have everything we need to draw the arc:
const {
  radius, // The radius we ended up using (might be smaller than the specified radius)
  angleA, // Angle from the fillet circle center to the tangent point on line A->I
  angleB, // Angle from the fillet circle center to the tangent point on line B->I
  tanPointA, // Arc start point
  tanPointB,  // Arc end point
  circleCenter, // Center point of the fillet circle
} = filletData;



```

## Building
### Library
`npm run build`
`npm run publish`

### Demo app dev
```.env
cd demo-app
npm install
npm run start
```


### Demo app release process
```.env
# To build the app
npm run build

# Release it to github pages
npm run deploy
```
