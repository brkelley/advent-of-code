let numRows = -1;
let numCols = -1;

class Robot {
  x: number;
  y: number;
  vX: number;
  vY: number;

  constructor (x: number, y: number, vX: number, vY: number) {
    this.x = x;
    this.y = y;
    this.vX = vX;
    this.vY = vY;
  }

  move () {
    const newX = this.x + this.vX;
    if (newX < 0) {
      this.x = numCols + newX;
    } else if (newX >= numCols) {
      this.x = newX % numCols;
    } else {
      this.x = newX;
    }

    const newY = this.y + this.vY;
    if (newY < 0) {
      this.y = numRows + newY;
    } else if (newY >= numRows) {
      this.y = newY % numRows;
    } else {
      this.y = newY;
    }
  }

  print () {
    console.log('Robot:')
    for (let y = 0; y < numRows; y++) {
      let row = '';
      for (let x = 0; x < numCols; x++) {
        if (x === this.x && y === this.y) {
          row += '#';
        } else {
          row += '.';
        }
      }
      console.log(row);
    }
  }
}

export function day (input: string[], isTestInput: boolean) {
  numRows = isTestInput ? 7 : 103;
  numCols = isTestInput ? 11 : 101;
  const robots = processInput(input, isTestInput);
  
  // iterate through all the robots
  // for (let i = 0; i < 1000; i++) {
  let i = 0;
  while (true) {
    if (i % 1000 === 0) {
      // console.log(`Seconds: ${i}`);
    }
    for (let robot of robots) {
      robot.move();
    }
    if (isChristmasTree(robots)) {
      console.log('potential tree:', i)
      printAllRobots(robots);
    }
    i++;
    // console.log(`Robots after ${i} seconds:`);
    // printAllRobots(robots);
  }

  // return countRobotQuadrants(robots);
}

function isChristmasTree (robots: Robot[]): boolean {
  const rowMap: {[key: number]: number} = {};
  const colMap: {[key: number]: number} = {};
  const num = 35;
  for (let robot of robots) {
    if (!rowMap[robot.y]) {
      rowMap[robot.y] = 1;
    } else {
      rowMap[robot.y]++;
    }
    if (!colMap[robot.x]) {
      colMap[robot.x] = 1;
    } else {
      colMap[robot.x]++;
    }
    if (rowMap[robot.y] >= num || colMap[robot.x] >= num) {
      return true;
    }
  }
  return false;
}

function printAllRobots (robots: Robot[]) {
  for (let y = 0; y < numRows; y++) {
    let row = '';
    for (let x = 0; x < numCols; x++) {
      const robotCount = robots.filter(robot => robot.x === x && robot.y === y);
      if (robotCount && robotCount.length > 0) {
        row += `${robotCount.length}`;
      } else {
        row += '.';
      }
    }
    console.log(row);
  }
}

function countRobotQuadrants (robots: Robot[]): number {
  // quadrants: top left, top right, bottom right, bottom left
  const quadrants = [0, 0, 0, 0];
  const qCols = Math.floor(numCols / 2);
  const qRows = Math.floor(numRows / 2);

  for (let robot of robots) {
    if (robot.x < qCols && robot.y < qRows) {
      quadrants[0]++;
    } else if (robot.x > qCols && robot.y < qRows) {
      quadrants[1]++;
    } else if (robot.x > qCols && robot.y > qRows) {
      quadrants[2]++;
    } else if (robot.x < qCols && robot.y > qRows) {
      quadrants[3]++;
    }
  }

  return quadrants.reduce((acc, val) => acc * val, 1);
}

function processInput (input: string[], isTestInput: boolean): Robot[] {
  const robots: Robot[] = [];
  const regexRobot = /p=(\d*),(\d*) v=(-?\d*),(-?\d*)/;
  for (let line of input) {
    const lineMatch = line.match(regexRobot);
    if (!lineMatch || lineMatch.length < 5) {
      throw new Error(`Invalid input: ${line}`);
    }
    robots.push(new Robot(
      Number(lineMatch[1]),
      Number(lineMatch[2]),
      Number(lineMatch[3]),
      Number(lineMatch[4])
    ))
  }

  return robots;
}
