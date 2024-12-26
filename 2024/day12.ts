import { convertCoordToString, convertStringToCoord, Coord } from './common';
import difference from 'lodash/difference';
const directions = ['up', 'right', 'down', 'left'];

class Garden {
  map: Plot[][];
  maxRows: number;
  maxCols: number;

  constructor (input: string[]) {
    this.map = [];
    this.maxRows = input.length;
    this.maxCols = input[0].length;
    for (let y = 0; y < input.length; y++) {
      const line = input[y];
      const lineArr = [];
      for (let x = 0; x < line.length; x++) {
        const plot = {
          plant: input[y][x]
        };
        lineArr.push(plot);
      }
      this.map.push(lineArr);
    }
  }

  getNearbyPlotCoord (coord: Coord, direction: string): Coord | null {
    const {x, y} = coord;
    switch (direction) {
      case 'up':
        if (y === 0)
          return null;
        return {x, y: y - 1};
      case 'down':
        if (y === this.maxRows - 1) 
          return null
        return {x, y: y+1};
      case 'left':
        if (x === 0)
          return null;
        return { x: x-1, y };
      case 'right':
        if (x === this.maxCols - 1)
          return null;
        return {x: x+1, y};
      default:
        return null;
    }
  }

  getDistinctPieces (): EdgeMap[] {
    const recursiveFindPieces = (coord: Coord, visitedPieces: CoordMap, piecesMap: EdgeMap, plotPlant: string): { visited: CoordMap, pieces: EdgeMap } => {
      let newVisited = {...visitedPieces};
      let newPieces = {...piecesMap};
      const {x, y} = coord;
      const activePlot = this.map[y][x].plant;
      if (activePlot !== plotPlant) {
        return { visited: newVisited, pieces: newPieces };
      }

      if (activePlot === plotPlant) {
        newPieces[convertCoordToString(coord)] = [];
      }
      newVisited[convertCoordToString(coord)] = 1;

      // check all directions
      for (let direction of directions) {
        const nearbyCoord = this.getNearbyPlotCoord(coord, direction);
        if (!nearbyCoord || this.map[nearbyCoord.y][nearbyCoord.x].plant !== plotPlant) {
          newPieces[convertCoordToString(coord)].push(direction);
        }
        if (nearbyCoord && !visitedPieces[convertCoordToString(nearbyCoord)]) {
          const {visited, pieces} = recursiveFindPieces(nearbyCoord, newVisited, newPieces, plotPlant);
          newVisited = {
            ...newVisited,
            ...visited
          }
          newPieces = {
            ...newPieces,
            ...pieces
          }
        }
      }

      return {
        visited: newVisited,
        pieces: newPieces
      };
    }

    let visitedPieces: CoordMap = {};
    const distinctPieces: EdgeMap[] = [];

    for (let y = 0; y < this.maxRows; y++) {
      for (let x = 0; x < this.maxCols; x++) {
        if (!visitedPieces[convertCoordToString({x, y})]) {
          // we need to find all pieces that are connected
          console.log(`Finding pieces for ${x}, ${y}`);
          const {visited, pieces} = recursiveFindPieces({x, y}, visitedPieces, {}, this.map[y][x].plant);
          visitedPieces = {
            ...visitedPieces,
            ...visited
          };
          distinctPieces.push(pieces);
        }
      }
    }

    return distinctPieces;
  }

  printPieces (pieces: EdgeMap) {
    console.log('\nLine:')
    for (let y = 0; y < this.maxRows; y++) {
      let line = '';
      for (let x = 0; x < this.maxCols; x++) {
        if (pieces[convertCoordToString({x, y})]) {
          line += '0';
        } else {
          line += '.';
        }
      }
      console.log(line)
    }
  }
}

type Plot = {
  plant: string;
}

type CoordMap = {
  [key: string]: number;
}

type EdgeMap = {
  [key: string]: string[];
}

export function day (input: string[]) {
  const garden = new Garden(input);
  const pieces = garden.getDistinctPieces();
  // console.log('Pieces:', pieces);
  let perimeterSum = 0;
  let areaSum = 0;
  let fullSum = 0;
  for (let piece of pieces) {
    // garden.printPieces(piece);
    const {perimeter, area} = calculateAreaAndPerimeterOfPiece(piece, garden);
    // console.log(`Perimeter: ${perimeter}, Area: ${area}`);
    perimeterSum += perimeter;
    areaSum += area;
    fullSum += perimeter * area;
  }
  return fullSum;
}

function calculateAreaAndPerimeterOfPiece (pieceMap: EdgeMap, garden: Garden): {perimeter: number, area: number} {
  // walk through all of the edges and calculate new perimeter
  let perimeter = 0;
  const visited: EdgeMap = {};

  for (let [coordKey, directions] of Object.entries(pieceMap)) {
    // console.log(`Checking ${coordKey} with directions ${directions}`);
    if (visited[coordKey] && visited[coordKey].length === directions.length) {
      continue;
    }
    const {x, y} = convertStringToCoord(coordKey);
    const unvisitedDirections = difference(directions, visited[coordKey]);
    // console.log(`Unvisited directions: ${unvisitedDirections}`);

    // first, register the visited coord
    visited[coordKey] = [];
    for (let direction of unvisitedDirections) {
      if (['left', 'right'].includes(direction)) {
        // register in the visited array
        visited[coordKey].push(direction);
        perimeter++;
        // register all visited coords directly up
        let upCoord = garden.getNearbyPlotCoord({x, y}, 'up');
        while (upCoord && pieceMap[convertCoordToString(upCoord)] && pieceMap[convertCoordToString(upCoord)].includes(direction)) {
          if (!visited[convertCoordToString(upCoord)]) {
            visited[convertCoordToString(upCoord)] = [direction];
          } else {
            visited[convertCoordToString(upCoord)].push(direction);
          }
          upCoord = garden.getNearbyPlotCoord(upCoord, 'up');
        }
        // register all visited coords directly down
        let downCoord = garden.getNearbyPlotCoord({x, y}, 'down');
        while (downCoord && pieceMap[convertCoordToString(downCoord)] && pieceMap[convertCoordToString(downCoord)].includes(direction)) {
          if (!visited[convertCoordToString(downCoord)]) {
            visited[convertCoordToString(downCoord)] = [direction];
          } else {
            visited[convertCoordToString(downCoord)].push(direction);
          }
          downCoord = garden.getNearbyPlotCoord(downCoord, 'down');
        }
      }
      if (['up', 'down'].includes(direction)) {
        // register in the visited array
        visited[coordKey].push(direction);
        perimeter++;
        // register all visited coords directly to the left
        let leftCoord = garden.getNearbyPlotCoord({x, y}, 'left');
        while (leftCoord && pieceMap[convertCoordToString(leftCoord)] && pieceMap[convertCoordToString(leftCoord)].includes(direction)) {
          if (!visited[convertCoordToString(leftCoord)]) {
            visited[convertCoordToString(leftCoord)] = [direction];
          } else {
            visited[convertCoordToString(leftCoord)].push(direction);
          }
          leftCoord = garden.getNearbyPlotCoord(leftCoord, 'left');
        }
        // register all visited coords directly to the right
        let rightCoord = garden.getNearbyPlotCoord({x, y}, 'right');
        while (rightCoord && pieceMap[convertCoordToString(rightCoord)] && pieceMap[convertCoordToString(rightCoord)].includes(direction)) {
          if (!visited[convertCoordToString(rightCoord)]) {
            visited[convertCoordToString(rightCoord)] = [direction];
          } else {
            visited[convertCoordToString(rightCoord)].push(direction);
          }
          rightCoord = garden.getNearbyPlotCoord(rightCoord, 'right');
        }
      }
      // console.log(`perimeter after ${direction}: ${perimeter}`);
    }
    // console.log(`Visited: ${JSON.stringify(visited)}`);
  }

  return {perimeter, area: Object.keys(pieceMap).length};
}





// function recursiveCalculateEdges (currentCoord: Coord, pieceMap: CoordMap, garden: Garden, visitedNodes) {
//   const horizontalEdges: {[key: number]: CoordMap} = {};
//   const verticalEdges: {[key: number]: CoordMap} = {};

//   const copyOfVisitedNodes = {
//     ...visitedNodes,
//     [convertCoordToString(currentCoord)]: true
//   };

//   let foundEdge = false;
//   for (let direction of directions) {
//     const nearbyCoord = garden.getNearbyPlotCoord(currentCoord, direction);
//     // if there is no nearby coord (edge of map) or no piece in the map (edge of piece),
//     // then we have found an edge
//     if (!nearbyCoord || !pieceMap[convertCoordToString(nearbyCoord)]) {
//       foundEdge = true;
//       // first, check if this is a vertical or horizontal edge
//       if (['up', 'down'].includes(direction)) {
//         // horizontal edge
//         // left first
//         let edgeCoords: CoordMap = { [convertCoordToString(currentCoord)]: true };
//         let leftCoord = garden.getNearbyPlotCoord(currentCoord, 'left');
//         while (leftCoord && pieceMap[convertCoordToString(leftCoord)]) {
//           edgeCoords[convertCoordToString(leftCoord)] = true;
//           visited
//           leftCoord = garden.getNearbyPlotCoord(leftCoord, 'left');
//         }
//         // right
//         let rightCoord = garden.getNearbyPlotCoord(currentCoord, 'right');
//         while (rightCoord && pieceMap[convertCoordToString(rightCoord)]) {
//           edgeCoords[convertCoordToString(rightCoord)] = true;
//           rightCoord = garden.getNearbyPlotCoord(rightCoord, 'right');
//         }
//         horizontalEdges[currentCoord.y] = edgeCoords;
//       } else {
//         // vertical edge
//         // up first
//         let edgeCoords: CoordMap = { [convertCoordToString(currentCoord)]: true };
//         let upCoord = garden.getNearbyPlotCoord(currentCoord, 'up');
//         while (upCoord && pieceMap[convertCoordToString(upCoord)]) {
//           edgeCoords[convertCoordToString(upCoord)] = true;
//           upCoord = garden.getNearbyPlotCoord(upCoord, 'up');
//         }
//         // down
//         let downCoord = garden.getNearbyPlotCoord(currentCoord, 'down');
//         while (downCoord && pieceMap[convertCoordToString(downCoord)]) {
//           edgeCoords[convertCoordToString(downCoord)] = true;
//           downCoord = garden.getNearbyPlotCoord(downCoord, 'down');
//         }
//         verticalEdges[currentCoord.y] = edgeCoords;
//       }
//     }
//   }
//   if (!foundEdge) {
//     return // something? Idk yet
//   } else {
//     console.log('horizontalEdges', horizontalEdges);
//     console.log('verticalEdges', verticalEdges)
//   }
// }
