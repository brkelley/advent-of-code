import axios from 'axios';
import * as fs from 'fs';

const processInput = async (dayDigit: Number, isTestInput: boolean) => {
  if (isTestInput) {
    return fs.readFileSync('test_input.txt','utf8').split('\n');
  }
  const request = await axios.get(`https://adventofcode.com/2024/day/${dayDigit}/input`, {
    headers: {
      Cookie: 'session=53616c7465645f5fd5e22475163b7f7a9a406acf6541f366e0b9ab7dc9e2f5757df2130f66b049f4ef710e66f037386f7c18696c21b633bc9c05a366ba9e3e10'
    }
  });
  return request.data.split('\n');
}

const start = async () => {
  if (process.argv.length < 3) {
    console.log('Please provide a day number');
    return;
  }
  const dayDigit = Number(process.argv[2]);
  const {day} = await import(`./day${dayDigit}.ts`);
  const isTestInput = process.argv.length > 3 && process.argv[3] === 'test';
  const input: string[] = await processInput(dayDigit, isTestInput);
  input.pop();
  const output = day(input, isTestInput);
  console.log(`Day ${dayDigit} Output: ${output}`);
}

start();