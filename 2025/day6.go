package main

import (
	"fmt"
	"strconv"
	"strings"
)

// init registers this day's solution
func init() {
	RegisterDay("6", Day6) // Replace N with the day number
}

// Day6 solves day 6
func Day6(lines []string) string {
	fmt.Println("Running Day 6 solution")
	// homework := createHomework(lines)
	homework := createHomeworkPart2(lines)
	sum := homework.Evaluate()
	return strconv.Itoa(sum)
}

type Assignment struct {
	nums     []int
	operator rune
}
type Homework struct {
	assignments []Assignment
}

func (a Assignment) Evaluate() int {
	sum := a.nums[0]
	for _, num := range a.nums[1:] {
		if a.operator == '+' {
			sum += num
		} else {
			sum *= num
		}
	}
	return sum
}

func (h Homework) Evaluate() int {
	sum := 0
	for _, assignment := range h.assignments {
		sum += assignment.Evaluate()
	}
	return sum
}

func processInputDay6(lines []string) Homework {
	homework := Homework{
		assignments: make([]Assignment, 0),
	}

	// convert to matrix
	matrix := [][]string{}
	for _, line := range lines {
		matrix = append(matrix, strings.Split(line, ""))
	}

	// now, we want to go top-to-bottom, reading all of the numbers & spaces
	// we know that the next assignment happens when we get a full row of spaces
	numCols := len(matrix[0])
	numRows := len(matrix)

	currentAssignment := Assignment{
		nums:     []int{},
		operator: '.',
	}
	for col := 0; col < numCols; col++ {

		hasAllSpaces := true
		currentNumStr := ""
		for row := 0; row < numRows; row++ {
			currentCharacter := matrix[row][col]
			// Check for a space
			if currentCharacter == " " {
				continue
			}
			hasAllSpaces = false
			// check for an operator
			if currentCharacter == "*" || currentCharacter == "+" {
				currentAssignment.operator = []rune(currentCharacter)[0]
			}
			if _, err := strconv.Atoi(currentCharacter); err == nil {
				fmt.Println("Current character:", currentCharacter)
				// Otherwise, build up the number
				currentNumStr += currentCharacter
			}
		}

		// if hasAllSpaces stayed true the whole time, we know there's a new assignment
		if hasAllSpaces {
			homework.assignments = append(homework.assignments, currentAssignment)
			currentAssignment = Assignment{
				nums:     []int{},
				operator: '.',
			}
		} else {
			// convert the number
			currentNum, err := strconv.Atoi(currentNumStr)
			fmt.Println(currentNum)
			if err != nil {
				fmt.Printf("ERROR ERROR ERROR parsing %v: %v\n", currentNumStr, err)
			}

			currentAssignment.nums = append(currentAssignment.nums, currentNum)
		}
	}

	homework.assignments = append(homework.assignments, currentAssignment)
	currentAssignment = Assignment{
		nums:     []int{},
		operator: '.',
	}

	return homework
}

func createHomeworkPart2(lines []string) Homework {
	homework := processInputDay6(lines)
	fmt.Println(homework)

	return homework
}

// func createHomework(lines []string) Homework {
// 	homework := Homework{
// 		assignments: make([]Assignment, 0),
// 	}
// 	spaceRegex := regexp.MustCompile(`\s+`)

// 	for lineIndex, line := range lines {
// 		// if line is the operators, add it to the homework
// 		if strings.Contains(line, "+") || strings.Contains(line, "*") {
// 			operators := spaceRegex.Split(strings.TrimSpace(line), -1)
// 			for operatorIndex, operator := range operators {
// 				cleanOperator := strings.TrimSpace(operator)
// 				homework.assignments[operatorIndex].operator = rune(cleanOperator[0])
// 			}
// 		} else {
// 			numDigits := spaceRegex.Split(strings.TrimSpace(line), -1)

// 			for numDigitIndex, numDigit := range numDigits {
// 				num, _ := strconv.Atoi(numDigit)
// 				if lineIndex == 0 {
// 					newAssignment := Assignment{
// 						nums:     []int{num},
// 						operator: '.',
// 					}
// 					homework.assignments = append(homework.assignments, newAssignment)
// 				} else {
// 					homework.assignments[numDigitIndex].nums = append(homework.assignments[numDigitIndex].nums, num)
// 				}
// 			}
// 		}
// 	}

// 	return homework
// }
