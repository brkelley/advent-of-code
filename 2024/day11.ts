export function day (input: string[]) {
  let stoneDict: { [key: number]: number } = input[0]
    .split(' ')
    .map((el) => Number(el))
    .reduce((acc, curr) => ({
      ...acc,
      [curr]: 1
    }), {});

  // console.log('Initial Arrangement')
  // console.log(stoneDict)
  for (let i = 0; i < 75; i++) {
    const newDict: { [key: number]: number } = {};
    for (let [keyStr, val] of Object.entries(stoneDict)) {
      const key = Number(keyStr);
      const digits = executeSingleStone(key);
      for (let digit of digits) {
        if (!newDict[digit]) {
          newDict[digit] = val;
        } else {
          newDict[digit] += val;
        }
      }
    }
    stoneDict = newDict;

    // console.log(`\nafter ${i + 1} blinks`)
    // console.log(stoneDict)
  }

  return Object.values(stoneDict).reduce((prev, curr) => prev + curr);
}

function executeSingleStone (stone: number): number[] {
  const stoneStr = `${stone}`;
  if (stone === 0) {
    return [1];
  } else if (stoneStr.length % 2 === 0) {
    return [
      Number(stoneStr.substring(0, stoneStr.length / 2)),
      Number(stoneStr.substring(stoneStr.length / 2)),
    ];
  } else {
    return [stone * 2024];
  }
}

function checkForSplittability (num: number): boolean {
  const str = `${num}`;
  return str.length % 2 === 0;
}


function executeNextStep (stonesOrig: number[]): number[] {
  const stones: number[] = [];
  for (let i = 0; i < stonesOrig.length; i++) {
    const stone = stonesOrig[i];
    const stoneStr = `${stone}`;
    if (stone === 0) {
      stones.push(1);
    } else if (stoneStr.length % 2 === 0) {
      stones.push(...[
        Number(stoneStr.substring(0, stoneStr.length / 2)),
        Number(stoneStr.substring(stoneStr.length / 2)),
      ])
    } else {
      stones.push(stone * 2024)
    }
  }
  return stones;
}