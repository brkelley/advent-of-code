type Manual = {
  order: Order;
  numStrings: number[][];
}

type Order = {
  [num: string]: number[];
}

export function day (input: string[]) {
  const manual = processInput(input);
  console.log(manual)

  let sum = 0;
  for (let seq of manual.numStrings) {
    if (recursiveCheckArray(manual.order, seq)) {
      // const middleNum = seq[Math.floor(seq.length / 2)];
      // sum += middleNum;
    } else {
      sum += reorderSequence(manual.order, seq);
    }
  }
  return sum;
}

function recursiveCheckArray (order: Order, arr: number[]): boolean {
  if (arr.length === 1) {
    return true;
  }
  const chosenOne = arr[0];
  
  const chosenOneOrder = order[chosenOne];
  if (!chosenOneOrder) {
    return false;
  }
  for (let i = 1; i < arr.length; i++) {
    const compared = arr[i];
    if (!chosenOneOrder.includes(compared)) {
      return false;
    }
  }
  return recursiveCheckArray(order, arr.slice(1));
}

function processInput (input: string[]): Manual {
  const manual: Manual = {
    order: {},
    numStrings: []
  };
  for (let line of input) {
    if (line.includes('|')) {
      const [init, follow] = line.split('|').map((el) => Number(el));

      if (!init) {
        break;
      }

      if (!manual.order[init]) {
        manual.order[init] = [follow];
      } else {
        manual.order[init].push(follow);
      }
    } else if (line.includes(',')) {
      const nums = line.split(',').map((el) => Number(el));
      manual.numStrings.push(nums);
    }
  }

  return manual;
}

function reorderSequence (order: Order, seq: number[]) {
  const orderedSeq: number[] = [];
  console.log('\nprocessing:', seq)
  for (let given of seq) {
    console.log('currently on ', given)
    const frozenNewSeq = [...orderedSeq];
    if (orderedSeq.length === 0) {
      orderedSeq.push(given);
    } else {
      // iterate through the numbers already in the sequence and check for the existence of the new one
      console.log('now going through the existing ordered sequence to see where it lands...')
      let inserted = false;
      for (let i = 0; i < frozenNewSeq.length; i++) {
        const comparedNumberInFrozenSequence = frozenNewSeq[i];
        const tempOrder = order[comparedNumberInFrozenSequence];
        if (!tempOrder) {
          orderedSeq.splice(i, 0, given);
          console.log(`${comparedNumberInFrozenSequence} does not have an order! inserting before`);
          inserted = true;
          break;
        } else if (tempOrder.includes(given)) {
          continue;
        } else {
          console.log(`${comparedNumberInFrozenSequence} does not have ${given} in their order! adding beforehand`)
          orderedSeq.splice(i, 0, given);
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        orderedSeq.push(given);
      }
    }
    console.log(`newSeq: ${orderedSeq}`)
  }
  console.log(orderedSeq);

  return orderedSeq[Math.floor(orderedSeq.length / 2)];
}


/**
 * seq: [ 97, 13, 75, 29, 47 ]
 * given: 
 * orderedSeq: [75]
 * 
 * 
 */