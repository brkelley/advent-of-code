package main

import (
	"fmt"
	"math"
	"slices"
	"sort"
	"strconv"
	"strings"
)

// init registers this day's solution
func init() {
	RegisterDay("5", Day5) // Replace N with the day number
}

type Range struct {
	min uint64
	max uint64
}

func (r Range) Contains(num uint64) bool {
	return num >= r.min && num <= r.max
}

type Pantry struct {
	ranges []Range
}

func (p Pantry) PrintRanges() {
	sort.Slice(p.ranges, func(i, j int) bool {
		return p.ranges[i].min < p.ranges[j].min
	})
	for _, r := range p.ranges {
		fmt.Println(r)
	}
}

func (p *Pantry) AddRange(newRange Range) {
	fmt.Println("Adding range: ", newRange)
	// Check if the range overlaps with any existing ranges
	if len(p.ranges) == 0 {
		p.ranges = append(p.ranges, newRange)
		return
	}
	overlappingRanges := []Range{}
	overlappingRanges = append(overlappingRanges, newRange)
	newRanges := []Range{}
	for _, r := range p.ranges {
		// if new range is inside existing range, return early
		if newRange.min >= r.min && newRange.max <= r.max {
			return
		}
		// check if new range fully contains any existing ranges
		// First, check if new range fully contains existing range
		if newRange.min <= r.min && newRange.max >= r.max {
			overlappingRanges = append(overlappingRanges, r)
		} else if newRange.min <= r.min && (newRange.max >= r.min && newRange.max <= r.max) {

			// Next, check if new range overlaps at the beginning of the existing range
			overlappingRanges = append(overlappingRanges, r)
		} else if newRange.max >= r.max && (newRange.min <= r.max && newRange.min >= r.min) {
			// Check if new range overlaps at the end of the existing range
			overlappingRanges = append(overlappingRanges, r)
		} else if newRange.max+1 == r.min || newRange.min-1 == r.max {
			// check if they're next to each other
			overlappingRanges = append(overlappingRanges, r)
		} else {
			newRanges = append(newRanges, r)
		}
	}
	fmt.Println("Overlapping ranges: ", overlappingRanges)
	// if there are no overlapping ranges, add the new range to the list
	if len(overlappingRanges) == 0 {
		newRanges = append(newRanges, newRange)
	} else {
		// next, morph all of the overlapping ranges
		newestMin := uint64(math.Inf(1))
		newestMax := uint64(math.Inf(-1))
		for _, r := range overlappingRanges {
			if r.min < newestMin {
				newestMin = r.min
			}
			if r.max > newestMax {
				newestMax = r.max
			}
		}
		newRanges = append(newRanges, Range{min: newestMin, max: newestMax})
	}

	p.ranges = newRanges
	p.PrintRanges()
}

func (p *Pantry) Contains(num uint64) bool {
	for _, r := range p.ranges {
		if r.Contains(num) {
			return true
		}
	}
	return false
}

func parseInput(lines []string) Pantry {
	pantry := Pantry{}

	for _, line := range lines {
		parts := strings.Split(line, "-")
		min, _ := strconv.ParseUint(parts[0], 10, 64)
		max, _ := strconv.ParseUint(parts[1], 10, 64)
		newRange := Range{min: min, max: max}
		fmt.Println()
		pantry.AddRange(newRange)
	}
	return pantry
}

func part2(pantry Pantry) string {
	count := uint64(0)
	fmt.Println("Pantry ranges: ", pantry.ranges)
	for _, r := range pantry.ranges {
		count += r.max - r.min + 1
	}
	return strconv.FormatUint(count, 10)
}

func part1(lines []string, pantry Pantry) string {
	// Go through the ingredients
	count := uint64(0)
	for _, ingredient := range lines {
		ingredientNum, _ := strconv.ParseUint(ingredient, 10, 64)
		if pantry.Contains(ingredientNum) {
			count++
		}
	}
	return strconv.FormatUint(count, 10)
}

// Day5 solves day 5
func Day5(lines []string) string {
	fmt.Println("Running Day 5 solution")

	emptyLineIndex := slices.Index(lines, "")

	pantry := parseInput(lines[:emptyLineIndex])

	// return part1(lines[emptyLineIndex+1:], pantry)
	return part2(pantry)
}
