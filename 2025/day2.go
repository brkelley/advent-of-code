package main

import (
	"fmt"
	"strconv"
	"strings"
)

// init registers this day's solution
func init() {
	RegisterDay("2", Day2)
}

func hasAllParts(part string, fullString string) bool {
	leftovers := strings.ReplaceAll(fullString, part, "")
	return len(leftovers) == 0
}

func analyzeRange(rangeStart int, rangeEnd int) int {
	sum := 0
	for currNum := rangeStart; currNum <= rangeEnd; currNum++ {
		currNumStr := strconv.Itoa(currNum)
		if currNumStr[0] == '0' {
			continue
		}

		for i := 0; i < len(currNumStr)/2; i++ {
			piece := currNumStr[:i+1]
			if hasAllParts(piece, currNumStr) {
				sum += currNum
				break
			}
		}

	}
	return sum
}

func Day2(lines []string) string {
	fmt.Println("Running Day 2 solution")
	line := lines[0]
	newLines := strings.Split(line, ",")

	sum := 0
	for _, lineStr := range newLines {
		rangeLimits := strings.Split(lineStr, "-")
		startNum, _ := strconv.Atoi(rangeLimits[0])
		endNum, _ := strconv.Atoi(rangeLimits[1])

		sum += analyzeRange(startNum, endNum)
	}

	return strconv.Itoa(sum)
}
