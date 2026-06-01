package main

import (
	"log"
	"os"

	"github.com/pressly/goose/v3"
)

func main() {
	if len(os.Args) < 2 {
		log.Fatalf("Usage: go run scripts/create_migration.go <migration_name>")
	}
	name := os.Args[1]

	// Programmatically create the SQL migration file in the "migrations" directory
	err := goose.Create(nil, "migrations", name, "sql")
	if err != nil {
		log.Fatalf("Failed to create migration: %v", err)
	}
	log.Printf("Migration '%s' created successfully in the migrations/ directory!", name)
}
