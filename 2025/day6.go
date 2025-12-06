package main

import "fmt"

// init registers this day's solution
func init() {
	RegisterDay("6", Day6) // Replace N with the day number
}

// Day6 solves day 6
func Day6(lines []string) string {
	fmt.Println("Running Day 6 solution")

	for i, line := range lines {
		fmt.Printf("Line %d: %s\n", i+1, line)
	}

	return "123"
}
