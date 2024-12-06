const DIRECTIONS = ['up', 'right', 'down', 'left'];

class FloorMap {
  map: string[][];
  obstacleLocations: Set<string>;
  startingCoords: Coord;
  direction: string;
  numRows: number;
  numCols: number;

  constructor () {
    this.map = [];
    this.obstacleLocations = new Set<string>;
    this.startingCoords = {
      x: -1,
      y: -1
    };
    this.direction = '';
    this.numRows = -1;
    this.numCols = -1;
  }

  isCoordsOffTheMap (coords: Coord) {
    return coords.x < 0 ||
      coords.y < 0 ||
      coords.x >= this.numCols ||
      coords.y >= this.numRows;
  }

  navigate (): { traversedSteps: Set<string>; isLooped: boolean; } {
    let currentPosition = this.startingCoords;
    const traversedSteps = new Set<string>;
    let numTraversedSpots = 0;
    let isLooped = false;
    while (!this.isCoordsOffTheMap(currentPosition)) {
      // console.log(`taking a step to (${currentPosition.x}, ${currentPosition.y})`)
      if (traversedSteps.has(coordToString(currentPosition))) {
        numTraversedSpots++;
      } else {
        traversedSteps.add(coordToString(currentPosition));
        numTraversedSpots = 0;
      }

      if (numTraversedSpots === 500) {
        isLooped = true;
        break;
      }
      currentPosition = this.takeAStep(currentPosition);
    }

    return { traversedSteps, isLooped };
  }

  takeAStep (coords: Coord): Coord {
    let potentialNextStep: Coord;

    switch (this.direction) {
      case 'up':
        potentialNextStep = { x: coords.x, y: coords.y - 1};
        break;
      case 'down':
        potentialNextStep = { x: coords.x, y: coords.y + 1};
        break;
      case 'left':
        potentialNextStep = { x: coords.x - 1, y: coords.y };
        break;
      case 'right':
        potentialNextStep = { x: coords.x + 1, y: coords.y };
        break;
      default:
        console.log('WERE IN THE DEFAULT STOP')
        potentialNextStep = { x: -1, y: -1 };
    }
    if (this.obstacleLocations.has(coordToString(potentialNextStep))) {
      const currentDirectionIndex = DIRECTIONS.findIndex(el => el === this.direction);
      this.direction = DIRECTIONS[(currentDirectionIndex + 1) % 4];
      // console.log('turning to this direction', this.direction);

      return coords;
    } else {
      return potentialNextStep;
    }
  }

  printLayout (steps: Set<string>) {
    console.log('\nMAP')
    for (let y = 0; y < this.numRows; y++) {
      let line = '';
      for (let x = 0; x < this.numCols; x++) {
        if (this.obstacleLocations.has(coordToString({x, y}))) {
          line += '#';
        } else if (steps.has(coordToString({x, y}))) {
          line += '+';
        } else {
          line += '.'
        }
      }
      console.log(line)
    }
  }
}

type Coord = {
  x: number;
  y: number;
}
function coordToString (coord: Coord) {
  return `${coord.x},${coord.y}`;
}

export function day (input: string[]) {
  const floorMap: FloorMap = processInput(input);
  const frozenDirection = floorMap.direction;
  const frozenStart = floorMap.startingCoords;
  // console.log(floorMap);

  const {traversedSteps, isLooped} = floorMap.navigate();
  if (isLooped) {
    return 'PANICCC';
  }
  // now, navigate again with 1 obstacle at a time
  let count = 0;
  for (let step of traversedSteps) {
    floorMap.direction = frozenDirection;
    floorMap.startingCoords = frozenStart;
    floorMap.obstacleLocations.add(step)
    
    const {traversedSteps: steps, isLooped } = floorMap.navigate();
    if (isLooped) {
      count++;
    }

    // floorMap.printLayout(steps);

    floorMap.obstacleLocations.delete(step);
  }
  return count;
}

function processInput (input: string[]): FloorMap {
  const floorMap = new FloorMap();
  floorMap.numRows = input.length;
  floorMap.numCols = input[0].length;
  for (let y = 0; y < input.length; y++) {
    const line = input[y];

    floorMap.map.push(line.split(''));

    for (let x = 0; x < line.length; x++) {
      const character = input[y][x];
      if (character === '#') {
        floorMap.obstacleLocations.add(coordToString({x, y}));
      } else if (character === '^') {
        floorMap.startingCoords = {x, y};
        floorMap.direction = 'up';
      }
    }
  }

  return floorMap;
}

// 4983 too high
// 4982 was right

// 2508 too high
// 1664 too high