package main

import (
	"fmt"
	"strconv"
	"strings"
)

// init registers this day's solution
func init() {
	RegisterDay("7", Day7)
}

func progressBeamsThroughTime(g BasicGrid, beams map[Coord]int) map[Coord]int {
	newBeams := make(map[Coord]int)

	for beamCoord, beamVal := range beams {
		// if beam is at the bottom, return ???
		if beamCoord.row == g.maxRows-1 {
			return beams
		}
		// check each beam's next spot
		nextBeamSpot := g.GetAt(beamCoord.row+1, beamCoord.col)

		if nextBeamSpot == "." {
			newCoord := Coord{row: beamCoord.row + 1, col: beamCoord.col}
			newBeams[newCoord] += beamVal
		} else if nextBeamSpot == "^" {
			fmt.Printf("Split encountered at (%v, %v)\n", beamCoord.row+1, beamCoord.col)
			leftCoord := Coord{row: beamCoord.row + 1, col: beamCoord.col - 1}
			rightCoord := Coord{row: beamCoord.row + 1, col: beamCoord.col + 1}

			if val, ok := newBeams[leftCoord]; ok {
				newBeams[leftCoord] = val + beamVal
			} else {
				newBeams[leftCoord] = beamVal
			}
			if val, ok := newBeams[rightCoord]; ok {
				newBeams[rightCoord] = val + beamVal
			} else {
				newBeams[rightCoord] = beamVal
			}
		}
	}
	fmt.Printf("new beams after a round: %v\n", newBeams)
	return progressBeamsThroughTime(g, newBeams)

}

func progressBeams(g BasicGrid, beams map[Coord]string, numSplitBeams int) int {
	newBeams := make(map[Coord]string)
	splitCount := 0

	for beamCoord := range beams {
		// if beam is at the bottom, return ???
		if beamCoord.row == g.maxRows-1 {
			return numSplitBeams
		}
		// check each beam's next spot
		nextBeamSpot := g.GetAt(beamCoord.row+1, beamCoord.col)
		if nextBeamSpot == "." {
			newBeams[Coord{row: beamCoord.row + 1, col: beamCoord.col}] = "|"
		} else if nextBeamSpot == "^" {
			splitCount++
			if _, ok := newBeams[Coord{row: beamCoord.row + 1, col: beamCoord.col - 1}]; !ok {
				newBeams[Coord{row: beamCoord.row + 1, col: beamCoord.col - 1}] = "|"
			}
			if _, ok := newBeams[Coord{row: beamCoord.row + 1, col: beamCoord.col + 1}]; !ok {
				newBeams[Coord{row: beamCoord.row + 1, col: beamCoord.col + 1}] = "|"
			}

		}
	}
	return progressBeams(g, newBeams, numSplitBeams+splitCount)
}

func Day7(lines []string) string {
	fmt.Println("Running Day 7 solution")
	manifold := buildManifold(lines)
	startingCoord, _ := manifold.FindInGrid("S")
	startingMap := make(map[Coord]int)
	startingMap[startingCoord] = 1

	finalBeams := progressBeamsThroughTime(manifold, startingMap)
	fmt.Printf("finalBeams: %v\n", finalBeams)

	sum := 0
	for _, val := range finalBeams {
		sum += val
	}
	return strconv.Itoa(sum)
}

func buildManifold(lines []string) BasicGrid {
	grid := BasicGrid{
		maxRows: len(lines),
		maxCols: len(lines[0]),
		grid:    [][]string{},
	}
	for _, line := range lines {
		grid.grid = append(grid.grid, strings.Split(line, ""))
	}

	return grid
}
