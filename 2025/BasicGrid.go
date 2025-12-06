package main

import (
	"fmt"
	"strings"
)

type Coord struct {
	row int
	col int
}

type BasicGrid struct {
	grid    [][]string
	maxRows int
	maxCols int
}

func (g BasicGrid) GetAt(row int, col int) string {
	return g.grid[row][col]
}

func (g BasicGrid) SetAt(row int, col int, value string) {
	g.grid[row][col] = value
}

func NewBasicGrid(lines []string) *BasicGrid {
	maxRows := len(lines)
	maxCols := len(lines[0])

	grid := &BasicGrid{
		grid:    make([][]string, maxRows),
		maxRows: maxRows,
		maxCols: maxCols,
	}

	for row := 0; row < maxRows; row++ {
		grid.grid[row] = strings.Split(lines[row], "")
	}

	return grid
}

func (g BasicGrid) Print() {
	for row := 0; row < g.maxRows; row++ {
		for col := 0; col < g.maxCols; col++ {
			fmt.Print(g.grid[row][col])
		}
		fmt.Println()
	}
}

/**
 * Returns an array of strings representing the neighbors
 * Starts at top left and goes typewriter style
 * If a neighbor is out of bounds, it is represented as a "-"
 * For example:
 * 1 2 3
 * 4 5 6
 * 7 8 9
 * GetNeighbors(1, 1) should return ["1", "2", "3", "4", "6", "7", "8", "9"]
 */
func (g BasicGrid) GetNeighbors(row int, col int) []string {
	neighbors := []string{}

	for y := row - 1; y <= row+1; y++ {
		for x := col - 1; x <= col+1; x++ {
			if y == row && x == col {
				continue
			}
			if y >= 0 && y < g.maxRows && x >= 0 && x < g.maxCols {
				neighbors = append(neighbors, g.GetAt(y, x))
			} else {
				neighbors = append(neighbors, "-")
			}
		}
	}

	return neighbors
}
