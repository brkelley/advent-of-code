import {File, FileSystem} from './classes/FileSystem';

export function day (input: string[]) {
  const fileSystem = new FileSystem(input[0]);
  fileSystem.printLine();
  // fillGaps(fileSystem);
  doPartTwo(fileSystem);
  return fileSystem.calculateChecksum();
}

function doPartTwo (fileSystem: FileSystem) {
  let toMoveIndex = fileSystem.files.length - 1;
  while (true) {
    const givenFile = fileSystem.files[toMoveIndex];
    console.log(givenFile);
    if (!givenFile) {
      break;
    }
    if (givenFile.isFreeSpace) {
      toMoveIndex--;
      continue;
    }
    // find the closest free space that fits
    let spotFound = false;
    for (let freeIdx = 0; freeIdx < toMoveIndex; freeIdx++) {
      const freeBlock = fileSystem.files[freeIdx];
      // if the block is not a free space or the free space is smaller than the given, skip
      if (!freeBlock.isFreeSpace || freeBlock.count < givenFile.count) {
        continue;
      }
      spotFound = true;
      // calculate how much free space is left over after changing
      const leftoverFreeBlock = {
        fileId: -1,
        startIndex: freeIdx + givenFile.count,
        count: freeBlock.count - givenFile.count,
        isFreeSpace: true
      }
      // change the given free space to an occupied space
      fileSystem.files[freeIdx] = {
        fileId: givenFile.fileId,
        startIndex: freeBlock.startIndex,
        count: givenFile.count,
        isFreeSpace: false
      }
      // add in the leftover block of free space
      if (leftoverFreeBlock.count > 0) {
        fileSystem.files.splice(freeIdx + 1, 0, leftoverFreeBlock)
      } else {
        toMoveIndex--;
      }
      // replace the space with free space now
      fileSystem.files[toMoveIndex + 1] = {
        ...fileSystem.files[toMoveIndex + 1],
        fileId: -1,
        isFreeSpace: true
      }
      // fileSystem.printLine();
      break;
    }
    if (!spotFound) {
      // couldn't find a free spot, move on
      toMoveIndex--;
    }
  }
  // return fileSystem.calculateChecksum();
}
/*
00...111...2...333.44.5555.6666.777.888899
0099.111...2...333.44.5555.6666.777.8888..
0099.1117772...333.44.5555.6666.....8888..
0099.111777244.333....5555.6666.....8888..
00992111777.44.333....5555.6666.....8888..



00...111...2...333.44.5555.6666.777.888899
0099.111...2...333.44.5555.6666.777.8888..
0099.1117772...333.44.5555.6666.....8888..
0099.111777244.333....5555.6666.....8888..
00992111777.44.333....5555.6666.....8888..
*/

function fillGaps (fileSystem: FileSystem) {
  while (true) {
    const freeBlockIndex = fileSystem.getFirstFreeBlockIndex();
    const occupiedBlockIndex = fileSystem.getLastOccupiedBlockIndex();
    const freeBlock = fileSystem.files[freeBlockIndex];
    const occupiedBlock = fileSystem.files[occupiedBlockIndex];
    if (!freeBlock || !occupiedBlock) {
      break;
    }
    if (freeBlock.count === occupiedBlock.count) {
      fileSystem.occupyFreeBlock(freeBlockIndex, occupiedBlockIndex);
    } else if (freeBlock.count < occupiedBlock.count) {
      fileSystem.occupyFreeBlock(freeBlockIndex, occupiedBlockIndex);
    } else {
      fileSystem.occupyFreeBlock(freeBlockIndex, occupiedBlockIndex);
    }
  }
}
