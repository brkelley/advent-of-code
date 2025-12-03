package main

import (
	"fmt"
	"math"
	"strconv"
)

// init registers this day's solution
func init() {
	RegisterDay("1", Day1)
}

// Day1 solves day 1
func Day1(input []string) string {
	fmt.Println("Running Day 1 solution")

	currentDial := 50
	sumZeroes := 0

	for _, line := range input {
		fmt.Printf("\nCurrent Dial: %d\n", currentDial)
		fmt.Println("Line: ", line)
		direction := line[0]
		distanceStr := line[1:]
		distance, err := strconv.Atoi(distanceStr)
		newDial := currentDial

		if err != nil {
			fmt.Println("Error converting distance to integer! Line: ", line)
			continue
		}

		if direction == 'L' {
			newDial -= distance
		} else {
			newDial += distance
		}

		// Count how many times we cross 0 during this rotation
		// We count positions in the open/closed intervals to exclude the starting position
		newZeroes := 0
		if direction == 'L' {
			// Left: count multiples of 100 in [newDial, currentDial)
			newZeroes = int(math.Floor(float64(currentDial-1)/100.0)) - int(math.Floor(float64(newDial-1)/100.0))
		} else {
			// Right: count multiples of 100 in (currentDial, newDial]
			newZeroes = int(math.Floor(float64(newDial)/100.0)) - int(math.Floor(float64(currentDial)/100.0))
		}
		fmt.Printf("Spinning from %d to %d caused %d zeroes\n", currentDial, newDial, newZeroes)

		// Wrap the dial position to 0-99 range
		currentDial = ((newDial % 100) + 100) % 100
		sumZeroes += newZeroes
	}

	return strconv.Itoa(sumZeroes)
}
