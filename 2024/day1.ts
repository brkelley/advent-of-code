export function day(input: string[]) {
  const list1: number[] = [];
  const list2: number[] = [];
  input.forEach((line) => {
    const [digit1, digit2] = line.split('   ');
    list1.push(Number(digit1));
    list2.push(Number(digit2));
  });
  list1.sort();
  list2.sort();

  let differences = 0;
  for (let i = 0; i < list1.length; i++) {
    differences += Math.abs(Math.max(list2[i], list1[i]) - Math.min(list2[i], list1[i]));
  }
  console.log('part 1:', differences)

  // part 2
  let newSum = 0;
  list1.forEach((list1Num) => {
    newSum += list2.filter((list2Num) => list1Num === list2Num).length * list1Num;
  });

  console.log('part 2:', newSum);
}
