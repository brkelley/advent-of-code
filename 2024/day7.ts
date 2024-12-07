type CalibrationEquation = {
  testValue: number;
  calibrationNumbers: number[];
}

export function day (input: string[]) {
  const calibrations = processInput(input);
  let sum = 0;
  for (let eq of calibrations) {
    // ternary loop
    for (let bin = 0; bin < 3**(eq.calibrationNumbers.length); bin++) {
      const check = testCalibrations(eq, bin);
      if (check) {
        sum += eq.testValue;
        break;
      }
    }
  }
  return sum;
}

function testCalibrations (eq: CalibrationEquation, bin: number): boolean {
  if (3**(eq.calibrationNumbers.length - 1) === bin) {
    return false;
  }
  const binString = convertNumberToBinaryString(bin, eq.calibrationNumbers.length - 1);

  // console.log(`testing ${eq.testValue} with binary ${binString}`)
  let result = eq.calibrationNumbers[0];
  for (let i = 1; i < eq.calibrationNumbers.length; i++) {
    const operatorBit = binString[i - 1];
    // 0 is addition, 1 is multiplication
    if (operatorBit === '0') {
      result += eq.calibrationNumbers[i];
    } else if (operatorBit === '1') {
      result *= eq.calibrationNumbers[i];
    } else if (operatorBit === '2') {
      result = Number('' + result + eq.calibrationNumbers[i]);
    }
  }
  
  if (result === eq.testValue) {
    return true;
  }

  return false;
}

function convertNumberToBinaryString (bin: number, length: number): string {
  // console.log('length:', length)
  const bitArr = new Array(length).fill('0')
  // console.log('bitArr:', (bitArr.join('') + bin.toString(2)).slice(length * -1));
  return (bitArr.join('') + bin.toString(3)).slice(length * -1);
}

function processInput (input: string[]): CalibrationEquation[] {
  const ce: CalibrationEquation[] = []
  for (let line of input) {
    const [testValue, potentials] = line.split(': ');
    const calibrationNumbers = potentials.split(' ').map((el) => Number(el));
    ce.push({ testValue: Number(testValue), calibrationNumbers });
  }
  return ce;
}
