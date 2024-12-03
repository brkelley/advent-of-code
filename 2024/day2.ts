const findDecreasing = (line: number[]): boolean => {
  // establish a start point
  let summ = line[0] - line [1] > 0 ? -1 : 1;
  // check next two points
  summ = summ + (line[1] - line [2] > 0 ? -1 : 1);
  summ = summ + (line[2] - line [3] > 0 ? -1 : 1);
  return summ < 0 ? true : false;
}

export function day(input: string[]) {
  let safeReports = 0;
  for (const line of input) {
    const lineDigits = line.split(' ').map((el) => Number(el));
    const isLineDecreasing = findDecreasing(lineDigits);
    const safe = isLineSafe(lineDigits, isLineDecreasing);
    if (safe) safeReports++;
    else {
      // attempt some removals
      for (let i = 0; i < lineDigits.length; i++) {
        const newArr = [...lineDigits];
        newArr.splice(i, 1);
        if (isLineSafe(newArr, isLineDecreasing)) {
          safeReports++;
          break;
        }
      }
    }
  }

  console.log('part 1: ', safeReports)
}

const isLineSafe = (line: number[], isDecreasing: boolean): boolean => {
  for (let i = 0; i < line.length - 1; i++) {
    const level = line[i];
    const nextLevel = line[i + 1];
    // console.log('level', level, nextLevel);

    // first, check if numbers are going the wrong way
    if ((isDecreasing && level - nextLevel < 0) || (!isDecreasing && level - nextLevel > 0)) {
      // console.log('wrong direction!', level, nextLevel)
      return false;
    }
    // next, check if gap is larger than 3 or the same number
    if (Math.abs(level - nextLevel) > 3 || level === nextLevel) {
      // console.log('big gap!', level, nextLevel)
      return false;
    }
  }

  return true;
}


/**
 * let safeReports = 0;
  input.forEach((line) => {
    const levels = line.split(' ').map((el) => Number(el));
    // console.log('line:', levels);
    let isSafe = true;
    let isDecreasing = findDecreasing(levels);
    // console.log(`this level is ${isDecreasing ? 'descreasing' : 'increasing'}`)
    let hasSafeDampenerBeenUsed = false;

    let i = 0;
    let manuallyChangeLevels = false;
    let level = -1;
    let nextLevel = -1;

    while (true) {
      if (i >=levels.length - 1) {
        break;
      }
      if (manuallyChangeLevels) {
        manuallyChangeLevels = false;
      } else {
        level = levels[i];
        nextLevel = levels[i + 1];
      }

      // console.log(`comparing ${level} and ${nextLevel}`)

      // check for errors in increase/decrease
      if ((isDecreasing && level < nextLevel) || (!isDecreasing && level > nextLevel)) {
        console.log(`UNSAFE: this line is ${isDecreasing ? 'decreasing' : 'increasing'} but ${level} and ${nextLevel} is not`)
        if (hasSafeDampenerBeenUsed) {
          isSafe = false;
          break;
        }
        manuallyChangeLevels = true;
        level = levels[i - 1];
        nextLevel = levels[i + 1];
        hasSafeDampenerBeenUsed = true;
      } else {
        // check diff
        const diff = Math.abs(level - nextLevel);
        if (diff > 3 || diff === 0) {
          if (diff > 3) {
            console.log(`UNSAFE: ${level} and ${nextLevel} has a diff of ${diff}, which is bigger than 3`)
          } else if (diff === 0) {
            console.log(`UNSAFE: ${level} and ${nextLevel} has a diff of ${diff}`);
          }
          if (hasSafeDampenerBeenUsed) {
            isSafe = false;
            break;
          }
          manuallyChangeLevels = true;
          // if this is the first index, just go to the next two
          if (i === 0) {
            level = levels[1];
            nextLevel = levels[2];
          } else {
            level = levels[i - 1];
            nextLevel = levels[i + 1];
          }
          hasSafeDampenerBeenUsed = true;
        }
      }

      if (!manuallyChangeLevels) {
        i++;
      }
    }
    // console.log(`\nthis line is ${isSafe ? 'safe' : 'unsafe'}\n`)
    if (isSafe) {
      safeReports++;
      // console.log('safe line:', line)
    } else {
      console.log('unsafe line:', line)
      console.log('');
    }
  })
 */