type Game = {
  buttonA: {
    x: number;
    y: number;
  },
  buttonB: {
    x: number;
    y: number;
  },
  prize: {
    x: number;
    y: number;
  }
}

export function day (input: string[]) {
  const games = processInput(input);
  let sum = 0;

  for (let game of games) {
    // const results = runGameIterations(game);
    const results = runGameIterationsPt2(game);
    if (results.length > 0) {
      let cheapestSum = Infinity;
      for (let result of results) {
        const sum = result.buttonA * 3 + result.buttonB * 1;
        if (sum < cheapestSum) {
          cheapestSum = sum;
        }
      }
      sum += cheapestSum;
    }
  }
  return sum;
}

function runGameIterationsPt2 (game: Game): {buttonA: number, buttonB: number}[] {
  const {buttonA, buttonB, prize} = game;
 /*
  equation 1: a * 94 + b * 22 = 8400
  94a + 22b = 8400
  equation 2: a * 34 + b * 67 = 5400
  34a + 67b = 5400

  94a + 22b = 8400 -> 94a = 8400 - 22b -> a = (8400 - 22b) / 94
  plug into equation 2:
  34 * ((8400 - 22b) / 94) + 67b = 5400
  aY * ((prizeX - buttonB.x * n) / buttonA.x) + buttonB.y * n = prizeY
  solve for b 
 */
  // step 1: convert the games into equations
  const numerator = prize.y * buttonA.x - buttonA.y * prize.x;
  const demonimator = buttonA.x * buttonB.y - buttonA.y * buttonB.x;
  const numberOfBPresses = numerator / demonimator;

  let numberOfAPresses = 0;
  if (numberOfBPresses % 1 === 0) {
    numberOfAPresses = (prize.x - buttonB.x * numberOfBPresses) / buttonA.x;
    if (numberOfAPresses % 1 !== 0) {
      return [];
    }
  } else {
    return [];
  }

  return [{ buttonA: numberOfAPresses, buttonB: numberOfBPresses }];
}

function runGameIterations (game: Game): {buttonA: number, buttonB: number}[] {
  const possibilities = [];
  const { buttonA, buttonB, prize } = game;

  // For each coordinate, add 1 value of B and as many values of A until we hit the prize
  // or we go over the prize value. if we hit the prize value, check the same amount for the Y value
  let xSum = 0;
  for (let buttonAPresses = 0; buttonAPresses < 100; buttonAPresses++) {
    console.log(`round with b presses = ${buttonAPresses}`);
    xSum += buttonB.x * buttonAPresses;

    let buttonBPresses = 0;
    while (xSum < prize.x) {
      xSum += buttonA.x;
      buttonBPresses++;
    }
    console.log(`a presses: ${buttonBPresses}`);
    // console.log(`total value of X: ${xSum}`);

    if (xSum === prize.x) {
      const ySum = buttonA.y * buttonBPresses + buttonAPresses * buttonB.y;
      // console.log(`CLOSE!! Y sum = ${ySum} (${buttonA.y} * ${buttonACount} * ${buttonB.y} + ${buttonBCount})`);
      if (ySum === prize.y) {
        console.log(`Button A: ${buttonBPresses}, Button B: ${buttonAPresses}`);
        possibilities.push({ buttonA: buttonBPresses, buttonB: buttonAPresses });
      }
    }
    xSum = 0;
  }

  return possibilities;
}

function processInput (input: string[]): Game[] {
  const regexButton = /X\+(\d*), Y\+(\d*)/;
  const regexPrize = /X\=(\d*), Y\=(\d*)/;
  const games: Game[] = [];
  let game = {
    buttonA: { x: 0, y: 0 },
    buttonB: { x: 0, y: 0 },
    prize: { x: 0, y: 0 }
  };
  for (let line of input) {
    if (line === '') {
      games.push(game);
      game = {
        buttonA: { x: 0, y: 0 },
        buttonB: { x: 0, y: 0 },
        prize: { x: 0, y: 0 }
      }
    } else if (line.includes('Button A') || line.includes('Button B')) {
      const match = line.match(regexButton);
      if (!Array.isArray(match) || match.length < 3) {
        throw new Error(`Invalid line: ${line}`);
      }
      const x = match[1];
      const y = match[2];
      if (line.includes('Button A')) {
        game.buttonA = { x: Number(x), y: Number(y) };
      } else if (line.includes('Button B')) {
        game.buttonB = { x: Number(x), y: Number(y) };
      }
    } else {
      const match = line.match(regexPrize);
      if (!Array.isArray(match) || match.length < 3) {
        throw new Error(`Invalid line: ${line}`);
      }
      const x = match[1];
      const y = match[2];
      game.prize = { x: Number(x) + 10000000000000, y: Number(y) + 10000000000000 };
    }
  }
  games.push(game);
  return games;
}
