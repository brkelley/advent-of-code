export type File = {
  fileId: number;
  startIndex: number;
  count: number;
  isFreeSpace: boolean;
}

export class FileSystem {
  freeBlocks: File[];
  occupiedBlocks: File[];
  files: File[];

  constructor (input: string) {
    this.freeBlocks = [];
    this.occupiedBlocks = [];
    this.files = [];
    let fileId = 0;
    let virtualArrayIndexCounter = 0;

    for (let [i, value] of input.split('').entries()) {
      const num = Number(value);
      const isFreeSpace = i % 2 === 1;
      const block = {
        fileId: isFreeSpace ? -1 : fileId,
        startIndex: virtualArrayIndexCounter,
        count: num,
        isFreeSpace
      };
      virtualArrayIndexCounter += num;
      if (isFreeSpace) {
        fileId++;
        if (num > 0) {
          this.freeBlocks.push(block);
          this.files.push(block);
        }
      } else {
        if (num > 0) {
          this.occupiedBlocks.push(block);
          this.files.push(block);
        }
      }
    }
  }

  getFirstFreeBlockIndex (): number {
    return this.files.findIndex((file) => file.isFreeSpace);
  }
  getLastOccupiedBlockIndex (): number {
    let occupiedBlockIndex;
    for (occupiedBlockIndex = this.files.length - 1; occupiedBlockIndex >= 0; occupiedBlockIndex--) {
      if (!this.files[occupiedBlockIndex].isFreeSpace) {
        return occupiedBlockIndex;
      }
    }
    return occupiedBlockIndex;
  }

  occupyFreeBlock (freeBlockIndex: number, occupiedBlockIndex: number) {
    const freeBlock = this.files[freeBlockIndex];
    let occupiedBlock = this.files[occupiedBlockIndex];

    let count = -1;
    if (freeBlock.count < occupiedBlock.count) {
      this.files[occupiedBlockIndex].count -= freeBlock.count;
      count = freeBlock.count;
    } else if (freeBlock.count > occupiedBlock.count) {
      const leftoverFreeBlock = {
        fileId: -1,
        startIndex: freeBlockIndex + occupiedBlock.count,
        count: freeBlock.count - occupiedBlock.count,
        isFreeSpace: true
      }
      this.files.splice(freeBlockIndex + 1, 0, leftoverFreeBlock);
      // adding one because we've added the free block index now
      this.files.splice(occupiedBlockIndex + 1, 1);
      count = occupiedBlock.count;
    } else {
      count = occupiedBlock.count;
      this.files.splice(occupiedBlockIndex, 1);
    }

    this.files[freeBlockIndex] = {
      fileId: occupiedBlock.fileId,
      startIndex: freeBlock.startIndex,
      count,
      isFreeSpace: false
    }

    // check for extra free space at the end
    const lastBlock = this.files[this.files.length - 1]
    if (lastBlock.isFreeSpace) {
      this.files.pop();
    }
  }

  calculateChecksum (): number {
    let sum = 0;
    let index = 0;
    for (let file of this.files) {
      for (let fileIndex = 0; fileIndex < file.count; fileIndex++) {
        if (file.fileId !== -1) {
          sum += (file.fileId * index);
        }
        index++;
      }
    }
    return sum;
  }

  printLine () {
    let finalString = '';

    for (let nextBlock of this.files) {
      const character = nextBlock.isFreeSpace ? '.' : `${nextBlock?.fileId}`;
      finalString += new Array(nextBlock.count + 1).join(character);
    }

    console.log(finalString);
  }
}