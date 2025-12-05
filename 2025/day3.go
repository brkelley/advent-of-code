package main

import (
	"fmt"
	"strconv"
)

// init registers this day's solution
func init() {
	RegisterDay("3", Day3) // Replace N with the day number
}

func findHighestNumber(startingNumber int, remainingLine string) int {
	startingNumberStr := strconv.Itoa(startingNumber)
	highestNumber := 0
	for _, char := range remainingLine {
		number, _ := strconv.Atoi(startingNumberStr + string(char))
		if number > highestNumber {
			highestNumber = number
		}
	}
	return highestNumber
}

func processLine(line string) int {
	highestNumber := 0
	for i := 0; i < len(line)-1; i++ {
		startingNumber, _ := strconv.Atoi(string(line[i]))
		remainingLine := line[i+1:]
		highestNumberTemp := findHighestNumber(startingNumber, remainingLine)
		if highestNumberTemp > highestNumber {
			highestNumber = highestNumberTemp
		}
	}
	return highestNumber
}

func findHighestPossibleDigit(line string, currentDigit int, previousHighestPossibleDigit int) (int, int) {
	highestPossibleDigit := 0
	highestPossibleDigitIndex := 0
	for i := previousHighestPossibleDigit + 1; i <= len(line)-(12-currentDigit); i++ {
		currentNumberStr := string(line[i])
		currentNumber, _ := strconv.Atoi(currentNumberStr)
		if currentNumber > highestPossibleDigit {
			highestPossibleDigit = currentNumber
			highestPossibleDigitIndex = i
		}
	}
	// fmt.Printf("highest possible digit for digit %v is %v at index %v\n", currentDigit, highestPossibleDigit, highestPossibleDigitIndex)
	return highestPossibleDigit, highestPossibleDigitIndex
}

func processLinePt2(line string) int {
	// starting with the first digit, find the highest number possible in that slot

	lineIndex := -1
	finalNumberStr := ""
	for i := 0; i < 12; i++ {
		highestPossibleDigit, highestPossibleDigitIndex := findHighestPossibleDigit(line, i, lineIndex)
		lineIndex = highestPossibleDigitIndex
		finalNumberStr += strconv.Itoa(highestPossibleDigit)
	}

	str := finalNumberStr

	number, _ := strconv.Atoi(str)
	return number
}

// Day3 solves day 3
func Day3(lines []string) string {
	fmt.Println("Running Day N solution")

	sum := 0
	for _, line := range lines {
		fmt.Println("\nLine: ", line)
		lineHighestNumber := processLinePt2(line)
		fmt.Println("Line Highest Number: ", lineHighestNumber)
		sum += lineHighestNumber
	}

	return strconv.Itoa(sum)
}
