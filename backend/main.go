package main

import (
	"golang-project/config"
	"golang-project/routes"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Load Environment Variables from .env file
	config.LoadEnv(".env")

	// 2. Initialize Database & Run migrations using Goose
	config.InitDB()

	r := gin.Default()
	routes.UsersRoutes(r)
	routes.BannerRoutes(r)

	log.Println("Backend server is running on http://localhost:8080")
	r.Run(":8080")
}
