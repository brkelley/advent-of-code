import { convertCoordToString, Coord } from "./common";

type TrailMap = {
  map: number[][];
  trailheadLocations: Coord[];
}

export function day (input: string[]) {
  const trailMap = processInput(input);
  // console.log('trailMap:', trailMap);
  return calculateTrailheadScores(trailMap);
}

let trailFinishers: string[] = [];
function calculateTrailheadScores (trailMap: TrailMap) {
  let score = 0;
  for (let trailhead of trailMap.trailheadLocations) {
    // console.log('\n\nstarting trailhead:', trailhead)
    trailFinishers = [];
    const trailScore = traverseArray(trailhead, trailMap.map, []);
    score += trailScore;
    // console.log(`trailhead (${trailhead.x}, ${trailhead.y}) has a score of ${trailScore}`)
  }

  return score;
}

function traverseArray (coords: Coord, map: number[][], path: string[]): number {
  const pathCopy = [...path];
  const location = map[coords.y][coords.x];
  pathCopy.push(convertCoordToString(coords));
  // console.log('path so far:')
  // console.log(pathCopy.map(el => `(${el})`).join('->'))
  if (location === 9) {
    // console.log('9 reached! heres the path:')
    // console.log(pathCopy.map(el => `(${el})`).join('->'))
    return 1;
    // if (trailFinishers.includes(convertCoordToString(coords))) {
    //   return 0;
    // } else {
    //   trailFinishers.push(convertCoordToString(coords));
    //   return 1;
    // }
  }
  let pathwayOut = false;
  let pathSums = 0;
  // up
  if (coords.y > 0) {
    const upLocation = map[coords.y - 1][coords.x];
    if (location + 1 === upLocation) {
      pathwayOut = true;
      pathSums += traverseArray({x: coords.x, y: coords.y - 1}, map, pathCopy);
    }
  }
  // down
  if (coords.y <= map.length - 2) {
    const downLocation = map[coords.y + 1][coords.x];
    if (location + 1 === downLocation) {
      pathwayOut = true;
      pathSums += traverseArray({x: coords.x, y: coords.y + 1}, map, pathCopy);
    }
  }
  // left
  if (coords.x > 0) {
    const leftLocation = map[coords.y][coords.x - 1];
    if (location + 1 === leftLocation) {
      pathwayOut = true;
      pathSums += traverseArray({x: coords.x - 1, y: coords.y}, map, pathCopy);
    }
  }
  // right
  if (coords.x <= map.length - 2) {
    const rightLocation = map[coords.y][coords.x + 1];
    if (location + 1 === rightLocation) {
      pathwayOut = true;
      pathSums += traverseArray({x: coords.x + 1, y: coords.y}, map, pathCopy);
    }
  }
  if (!pathwayOut) {
    return 0;
  }
  pathCopy.pop();
  return pathSums;
}

function processInput (input: string[]): TrailMap {
  const trailMap = [];
  const trailheadLocations = [];
  for (let y = 0; y < input.length; y++) {
    const line = input[y];
    const lineArr = [];
    for (let x = 0; x < line.length; x++) {
      lineArr.push(Number(input[y][x]));
      if (Number(input[y][x]) === 0) {
        trailheadLocations.push({x, y});
      }
    }
    trailMap.push(lineArr);
  }

  return { map: trailMap, trailheadLocations };
}
