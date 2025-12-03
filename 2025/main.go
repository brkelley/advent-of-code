package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

// DaySolution is the function signature for day solutions
type DaySolution func([]string) string

// daySolutions is the registry where each day registers its solution
var daySolutions = make(map[string]DaySolution)

// RegisterDay allows each day file to register its solution in init()
func RegisterDay(day string, solution DaySolution) {
	daySolutions[day] = solution
}

func getInputByTextFile() []string {
	filePath, err := os.Open("./test-input.txt")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error opening test input file: %v\n", err)
		os.Exit(1)
	}
	defer filePath.Close()

	// Read all content
	content, err := io.ReadAll(filePath)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading test input file: %v\n", err)
		os.Exit(1)
	}

	return strings.Split(string(content), "\n")
}

func getRealInput(day string) []string {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Warning: Error loading .env file: %v\n", err)
	}

	// Get session cookie from environment variable
	sessionCookie := os.Getenv("AOC_SESSION")
	if sessionCookie == "" {
		fmt.Fprintf(os.Stderr, "AOC_SESSION environment variable not set\n")
		fmt.Fprintf(os.Stderr, "Please create a .env file with: AOC_SESSION=your_session_cookie\n")
		os.Exit(1)
	}

	// Create HTTP client and request
	url := fmt.Sprintf("https://adventofcode.com/2025/day/%s/input", day)
	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error creating request: %v\n", err)
		os.Exit(1)
	}

	// Add session cookie
	req.AddCookie(&http.Cookie{
		Name:  "session",
		Value: sessionCookie,
	})

	// Make the request
	resp, err := client.Do(req)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error fetching input: %v\n", err)
		os.Exit(1)
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode != http.StatusOK {
		fmt.Fprintf(os.Stderr, "Error: received status code %d\n", resp.StatusCode)
		os.Exit(1)
	}

	// Read the response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error reading response: %v\n", err)
		os.Exit(1)
	}
	arr := strings.Split(string(body), "\n")

	return arr[:len(arr)-1]
}

func main() {
	// Get day number from command line arguments
	args := os.Args
	if len(args) < 2 {
		fmt.Fprintf(os.Stderr, "Usage: go run . <day> [test]\n")
		os.Exit(1)
	}
	day := args[1]

	// Check if using test input
	useTestInput := len(args) >= 3 && args[2] == "test"

	var input []string
	if useTestInput {
		fmt.Fprintf(os.Stderr, "Using test input\n")
		input = getInputByTextFile()
	} else {
		fmt.Fprintf(os.Stderr, "Using real input\n")
		input = getRealInput(day)
	}

	// Look up and call the day's solution
	solution, exists := daySolutions[day]
	if !exists {
		fmt.Fprintf(os.Stderr, "No solution found for day %s\n", day)
		fmt.Fprintf(os.Stderr, "Make sure you have a day%s.go file that registers the solution\n", day)
		os.Exit(1)
	}

	// Run the solution
	answer := solution(input)
	fmt.Printf("Day %s Answer: %s\n", day, answer)
}
