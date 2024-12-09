export type Coord = {
  x: number;
  y: number;
}

export function convertCoordToString (coord: Coord): string {
  return `${coord.x},${coord.y}`;
}
export function convertStringToCoord (coordString: string): Coord {
  const [x, y] = coordString.split(',')
  return {
    x: Number(x),
    y: Number(y)
  };
}
export function distanceBetweenCoords (coord1: Coord, coord2: Coord) {
  return Math.sqrt(Math.pow(coord2.x - coord1.x, 2) + Math.pow(coord2.y - coord1.y, 2));
}
export function calculateSlope (coord1: Coord, coord2: Coord) {
  return (coord2.y - coord1.y) / (coord2.x - coord1.x);
}

// export function calculateVector (pointA: Coord, pointB: Coord) {

// }

export function findPointGivenDistance (pointA: Coord, pointB: Coord, distance: number, isPositive: boolean): Coord {
  const pointVector = {
    x: pointB.x - pointA.x,
    y: pointB.y - pointA.y
  };
  const vectorLength = Math.abs(Math.sqrt(Math.pow(pointVector.x, 2) + Math.pow(pointVector.y, 2)));
  const unitVector = {
    x: pointVector.x / vectorLength,
    y: pointVector.y / vectorLength
  };
  const vectorWithDistance = {
    x: unitVector.x * distance,
    y: unitVector.y * distance
  }
  if (isPositive) {
    return {
      x: pointB.x + vectorWithDistance.x,
      y: pointB.y + vectorWithDistance.y
    }
  }

  return {
    x: pointA.x - vectorWithDistance.x,
    y: pointA.y - vectorWithDistance.y
  }
}

// (𝑚2+1)(𝑥2−𝑥1)2=𝑑2
