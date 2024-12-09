import {Coord, distanceBetweenCoords, findPointGivenDistance} from './common';

type CityMap = {
  grid: string[][];
  antennas: Antenna;
  antennaMap: AntennaMap;
  maxRows: number;
  maxCols: number;
}
type Antenna = {
  [key: string]: Coord[];
}
// { 3,2: '#' }
type AntennaMap = {
  [key: string]: string;
}

export function day (input: string[]) {
  const cityMap = processInput(input);
  const antinodeMap: AntennaMap = {};
  for (let antennaCoords of Object.values(cityMap.antennas)) {
    const newAntinodes = calculateAntinodes(antennaCoords, cityMap)
    for (let antinode of newAntinodes) {
      antinodeMap[`${antinode.x},${antinode.y}`] = '#';
    }
  }
  console.log('antinodeMap:', antinodeMap)
  printMap(cityMap, antinodeMap);
  return Object.values(antinodeMap).length;
}

function calculateAntinodes (antennaCoords: Coord[], cityMap: CityMap): Coord[] {
  const antinodes = [];
  for (let i = 0; i < antennaCoords.length; i++) {
    const startCoord = antennaCoords[i];
    for (let j = i + 1; j < antennaCoords.length; j++) {
      const compareCoord = antennaCoords[j];
      const pointVector = {
        x: compareCoord.x - startCoord.x,
        y: compareCoord.y - startCoord.y
      }
      // go positive
      let nextPoint = compareCoord;
      while (true) {
        nextPoint = {
          x: nextPoint.x + pointVector.x,
          y: nextPoint.y + pointVector.y
        };
        if (nextPoint.x < 0 || nextPoint.x >= cityMap.maxCols || nextPoint.y < 0 || nextPoint.y >= cityMap.maxRows) {
          break;
        }
        antinodes.push(nextPoint);
      }
      // go negative
      nextPoint = startCoord;
      while (true) {
        nextPoint = {
          x: nextPoint.x - pointVector.x,
          y: nextPoint.y - pointVector.y
        };
        if (nextPoint.x < 0 || nextPoint.x >= cityMap.maxCols || nextPoint.y < 0 || nextPoint.y >= cityMap.maxRows) {
          break;
        }
        if (nextPoint.x === 5 && nextPoint.y === 0) {
          console.log('THIS ONE????')
          console.log('compareCoord:', compareCoord)
          console.log('startCoord:', startCoord);
        }
        antinodes.push(nextPoint);
      }

      antinodes.push(startCoord);
      antinodes.push(compareCoord);




      // const distance = distanceBetweenCoords(startCoord, compareCoord)
      // const positivePoint = findPointGivenDistance(startCoord, compareCoord, distance, true);
      // const negativePoint = findPointGivenDistance(startCoord, compareCoord, distance, false);

      // if (
      //   positivePoint.x >= 0 &&
      //   positivePoint.x < cityMap.maxCols &&
      //   positivePoint.y >= 0 &&
      //   positivePoint.y < cityMap.maxRows
      // ) {
      //   antinodes.push(positivePoint);
      // }
      // if (
      //   negativePoint.x >= 0 &&
      //   negativePoint.x < cityMap.maxCols &&
      //   negativePoint.y >= 0 &&
      //   negativePoint.y < cityMap.maxRows
      // ) {
      //   antinodes.push(negativePoint);
      // }
    }
  }
  return antinodes;
}

function printMap (cityMap: CityMap, antinodeMap: AntennaMap) {
  console.log();
  for (let y = 0; y < cityMap.maxRows; y++) {
    let row = '';
    for (let x = 0; x < cityMap.maxCols; x++) {
      if (cityMap.antennaMap[`${x},${y}`]) {
        row += cityMap.antennaMap[`${x},${y}`];
      }
      else if (antinodeMap[`${x},${y}`]) {
        row += '#';
      } else {
        row += cityMap.grid[y][x];
      }
    }
    console.log(row);
  }
}

function processInput (input: string[]): CityMap {
  const antennas: Antenna = {};
  const antennaMap: AntennaMap = {};
  const grid: string[][] = [];
  for (let y = 0; y < input.length; y++) {
    const line = input[y];
    const gridRow = [];
    for (let x = 0; x < line.length; x++) {
      const character = line[x];
      gridRow.push(character);
      if (character !== '.') {
        antennaMap[`${x},${y}`] = character;
        if (!antennas[character]) {
          antennas[character] = [{x, y}];
        } else {
          antennas[character].push({x, y});
        }
      }
    }
    grid.push(gridRow);
  }

  return {
    antennas,
    antennaMap,
    grid,
    maxRows: input.length,
    maxCols: input[0].length
  }
}