package config

import (
	"bufio"
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

	_ "github.com/lib/pq" // PostgreSQL driver
	"github.com/pressly/goose/v3"
)

// DB is the global database connection pool
var DB *sql.DB

// LoadEnv reads the .env file and sets environment variables manually
func LoadEnv(path string) {
	file, err := os.Open(path)
	if err != nil {
		log.Printf("Warning: .env file not found at %s, using system environment variables", path)
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()
		line = strings.TrimSpace(line)

		// Skip empty lines and comments
		if len(line) == 0 || strings.HasPrefix(line, "#") {
			continue
		}

		// Split by first '='
		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			continue
		}

		key := strings.TrimSpace(parts[0])
		val := strings.TrimSpace(parts[1])

		// Remove optional surrounding quotes
		val = strings.Trim(val, `"'`)

		os.Setenv(key, val)
	}
}

// InitDB establishes connection to PostgreSQL and runs goose migrations
func InitDB() {
	// 1. Connection string create karein (using env variables loaded from .env)
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		getEnv("DB_HOST", "localhost"),
		getEnv("DB_PORT", "5432"),
		getEnv("DB_USER", "postgres"),
		getEnv("DB_PASSWORD", ""),
		getEnv("DB_NAME", "golang_project"),
	)

	// 2. Database connection open karein
	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Error opening database connection: %v", err)
	}

	// 3. Connection verify karein using Ping
	err = DB.Ping()
	if err != nil {
		log.Fatalf("Error connecting to database: %v. Please make sure PostgreSQL is running.", err)
	}

	log.Println("Successfully connected to Database!")

	// 4. Run Goose migrations programmatically
	log.Println("Running database migrations via Goose...")

	// Dialect set karein (postgres)
	if err := goose.SetDialect("postgres"); err != nil {
		log.Fatalf("Goose set dialect error: %v", err)
	}

	// "./migrations" directory se migrations ko apply karein
	migrationDir := "./migrations"
	if err := goose.Up(DB, migrationDir); err != nil {
		if err == goose.ErrNoMigrationFiles {
			log.Println("No migration files found in migrations/ folder. Skipping migrations...")
		} else {
			log.Fatalf("Goose migration error: %v", err)
		}
	}

	log.Println("Database migrations applied successfully!")
}

// getEnv checks system/loaded environment variable or returns default value
func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

// arbaaz
