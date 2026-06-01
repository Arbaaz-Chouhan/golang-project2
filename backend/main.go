package main

import (
	"log"
	"golang-project/config"
)

func main() {
	// 1. Load Environment Variables from .env file
	config.LoadEnv(".env")

	// 2. Initialize Database & Run migrations using Goose
	config.InitDB()

	log.Println("Backend server is ready! Start writing your code.")
}
