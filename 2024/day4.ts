type Coord = {
  x: number;
  y: number;
}

class WordSearch {
  grid: string[][];
  maxRows: number;
  maxCols: number;

  constructor (input: string[]) {
    const wordSearch: string[][] = [];
    for (let line of input) {
      wordSearch.push(line.split(''));
    }
    this.grid = wordSearch;
    this.maxRows = input.length;
    this.maxCols = input[0].length;
  }

  getLetterAtCoord (coord: Coord) {
    return this.grid[coord.y][coord.x];
  }

  checkCoordForCross (coord: Coord): boolean {
    if (this.getLetterAtCoord({x: coord.x + 1, y: coord.y + 1}) !== 'A') {
      return false;
    }
    const corners = [
      this.getLetterAtCoord(coord),
      this.getLetterAtCoord({x: coord.x, y: coord.y + 2}),
      this.getLetterAtCoord({x: coord.x + 2, y: coord.y}),
      this.getLetterAtCoord({x: coord.x + 2, y: coord.y + 2}),
    ];
    const areCornersValid = corners.filter((l) => l === 'M').length === 2 && corners.filter((l) => l === 'S').length === 2;
    const leftToRight =
      this.getLetterAtCoord({x: coord.x + 2, y: coord.y + 2}) !== this.getLetterAtCoord(coord);
    const rightToLeft =
      this.getLetterAtCoord({x: coord.x + 2, y: coord.y}) !== this.getLetterAtCoord({x: coord.x, y: coord.y + 2})

    return areCornersValid && leftToRight && rightToLeft;

    // console.log(`\nlooking at coord (${coord.x}, ${coord.y})`)
    // for (let y = 0; y <= 2; y++) {
    //   let str = '';
    //   for (let x = 0; x <= 2; x++) {
    //     if (x === 1 && y === 1) str += 'A';
    //     else if (x === 1 || y === 1) str += '.';
    //     else str += this.getLetterAtCoord({x: coord.x + x, y: coord.y + y});
    //   }
    //   console.log(str)
    // }
    // console.log('valid square:', corners.filter((l) => l === 'M').length === 2 && corners.filter((l) => l === 'S').length === 2)
    // return corners.filter((l) => l === 'M').length === 2 && corners.filter((l) => l === 'S').length === 2;
  }
}

export function day(input: string[]) {
  const wordSearch = new WordSearch(input);

  let validWordSum = 0;

  for (let y = 0; y < wordSearch.maxRows - 2; y++) {
    for (let x = 0; x < wordSearch.maxCols - 2; x++) {
      // console.log(`\nlooking at coord (${x}, ${y})`)
      if (wordSearch.checkCoordForCross({x, y})) {
        validWordSum++;
      }
    }
  }

  // 1906 too high

  // Part 1 shit
  // for (let y = 0; y < wordSearch.maxRows; y++) {
  //   for (let x = 0; x < wordSearch.maxCols; x++) {
  //     for (let xDir of ['left', '', 'right']) {
  //       for (let yDir of ['up', '', 'down']) {
  //         if (xDir === '' && yDir === '') {
  //           continue;
  //         }
  //         // console.log(`Checking coordinates (${x}, ${y}) going ${xDir} & ${yDir}`)
  //         const check = recursiveCheck(wordSearch, '', {x, y}, xDir, yDir);
  //         // console.log('check results: ', check)
  //         if (check) validWordSum++;
  //       }
  //     }
  //   }
  // }

  return validWordSum;
}

function recursiveCheck (wordSearch: WordSearch, currentString: string, coord: Coord, xDir: string, yDir: string): boolean {
  // if we're at 4 letters, return!
  if (currentString.length === 4) {
    // console.log('string is 4 long! string:', currentString);
    return currentString === 'XMAS';
  }

  // if one or more of the coordinates is outside of the grid, return
  if ((coord.x < 0 || coord.x >= wordSearch.maxCols) || (coord.y < 0 || coord.y >= wordSearch.maxRows)) {
    // console.log(`(${coord.x}, ${coord.y}) is out of bounds`)
    return false;
  }

  const newString = currentString + wordSearch.getLetterAtCoord(coord);
  const newCoords = {
    x: xDir === 'left' ? coord.x - 1 : (xDir === 'right' ? coord.x + 1 : coord.x),
    y: yDir === 'up' ? coord.y - 1 : yDir === 'down' ? coord.y + 1 : coord.y
  };

  // console.log(`end of recursion: (${coord.x}, ${coord.y}) - ${newString}`)

  return recursiveCheck(wordSearch, newString, newCoords, xDir, yDir);
}

/**
 * 0 = up
 * 1 = up & right
 * 2 = right
 * 3 = down & right
 * 4 = down
 * 5 = down & left
 * 6 = left
 * 7 = up & left
 */
// function checkInDirection (wordSearch: string[][], init: Coord, direction: number): boolean {
//   let currentLetter = wordSearch[init.x][init.y];
//   let currentWord = currentLetter;

//   console.log('building:')
//   console.log('1. ', currentWord)

//   for (let i = 0; i < 3; i++) {
//     let newCoords = incrementCoordinates(init, direction);
//     if (!newCoords || newCoords.x < 0 || newCoords.y < 0 || newCoords.y > wordSearch.length - 1 || newCoords.x > wordSearch[newCoords.y].length - 1) {
//       return false;
//     }
//     currentWord += wordSearch[newCoords.x][newCoords.y];
//     console.log(`${i + 2}: ${currentWord}`);
//   }

//   return currentWord === 'XMAS';
// }

// function incrementCoordinates (init: Coord, direction: number): Coord | null {
//   switch (direction) {
//     case 0:
//       return {x: init.x, y: init.y - 1};
//     case 1:
//       return {x: init.x + 1, y: init.y - 1};
//     case 2:
//       return {x: init.x + 1, y: init.y};
//     case 3:
//       return {x: init.x + 1, y: init.y + 1};
//     case 4:
//       return {x: init.x + 1, y: init.y};
//     case 5:
//       return {x: init.x - 1, y: init.y + 1};
//     case 6:
//       return {x: init.x - 1, y: init.y};
//     case 7:
//       return {x: init.x - 1, y: init.y - 1};
//     default:
//       return null;
//   }
// }
