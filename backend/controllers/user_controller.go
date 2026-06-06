package controllers

import (
	"golang-project/config"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func RegisterUserController(c *gin.Context) {
	type req struct {
		Name     string `json:"name" binding:"required"`
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	var request req

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 1. Check karein ki email pehle se exist toh nahi karta
	var emailExists bool
	checkQuery := `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`
	err := config.DB.QueryRow(checkQuery, request.Email).Scan(&emailExists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error", "details": err.Error()})
		return
	}

	if emailExists {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}

	// 2. Password ko securely hash karein
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(request.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// 3. Database mein data insert karein
	query := `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id`
	var userID int
	err = config.DB.QueryRow(query, request.Name, request.Email, string(hashedPassword)).Scan(&userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user", "details": err.Error()})
		return
	}

	// 4. Success response send karein
	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
		"user_id": userID,
	})
}
