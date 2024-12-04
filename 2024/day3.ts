type Instruction = {
  num1: number;
  num2: number
}

export function day(input: string[]) {
  let sum = 0;
  const line = input.join();
  console.log('line:    ', line)
  const newString = replaceForbiddenSections(line);
  console.log('replaced:', newString)
  const allowedMultipliers = findAllMatches(newString);
  let multStr = '';
  for (let mult of allowedMultipliers) {
    multStr += `multiply(${mult.num1},${mult.num2}), `
  }

  for (let instruction of allowedMultipliers) {
    sum += processInstructionAndMultiply(instruction);
  }
  return sum;
}

const processInstructionAndMultiply = (instr: Instruction): number => {
  return instr.num1 * instr.num2;
}

const findAllMatches = (line: string): Instruction[] => {
  const regex = /mul\((\d*),(\d*)\)/g;
  const matches = [...line.matchAll(regex)];

  return matches.map((match) => ({
    num1: Number(match[1]),
    num2: Number(match[2])
  }));
}

const replaceForbiddenSections = (line: string): string => {
  const regex = /(don't\(\).*?do\(\))/;
  let replacedString = line;

  let ongoingMatch = regex.exec(replacedString);
  while (ongoingMatch !== null) {
    console.log('match:', ongoingMatch);
    replacedString = replacedString.replace(regex, '');
    ongoingMatch = regex.exec(replacedString);
  }
  const endOfStringRegex = /(don't\(\))(.*?)$/g;

  return replacedString.replace(endOfStringRegex, '');
}

// 117549707 too high
// 122468123 too high
// 56376291 too low
// 48642777 not right
// 93704554 not right
// 108830766