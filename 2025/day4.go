package main

import (
	"fmt"
	"strconv"
)

// init registers this day's solution
func init() {
	RegisterDay("4", Day4) // Replace N with the day number
}

func countAllRolls(neighbors []string) int {
	count := 0
	for _, neighbor := range neighbors {
		if neighbor == "@" {
			count++
		}
	}
	return count
}

func Day4Part2(lines []string) string {
	fmt.Println("Running Day 4 solution")

	grid := NewBasicGrid(lines)
	removedForklifts := 0
	forkliftsToRemove := []Coord{}
	didRemove := false
	for {
		didRemove = false
		for row := 0; row < grid.maxRows; row++ {
			for col := 0; col < grid.maxCols; col++ {
				if grid.GetAt(row, col) == "@" {
					neighbors := grid.GetNeighbors(row, col)
					count := countAllRolls(neighbors)
					if count < 4 {
						removedForklifts++
						forkliftsToRemove = append(forkliftsToRemove, Coord{row, col})
						didRemove = true
					}
				}
			}
		}
		if !didRemove {
			break
		}
		for _, coord := range forkliftsToRemove {
			grid.SetAt(coord.row, coord.col, ".")
		}
		forkliftsToRemove = []Coord{}
	}

	return strconv.Itoa(removedForklifts)
}

func Day4Part1(lines []string) string {
	fmt.Println("Running Day 4 solution")

	grid := NewBasicGrid(lines)

	availableForklifts := 0
	for row := 0; row < grid.maxRows; row++ {
		for col := 0; col < grid.maxCols; col++ {
			if grid.GetAt(row, col) == "@" {
				// Check neighbors for @
				neighbors := grid.GetNeighbors(row, col)
				count := countAllRolls(neighbors)
				if count < 4 {
					availableForklifts++
				}
			}
		}
	}

	return strconv.Itoa(availableForklifts)
}

// Day4 solves day 4
func Day4(lines []string) string {
	// return Day4Part1(lines)
	return Day4Part2(lines)
}
