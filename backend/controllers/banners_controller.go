package controllers

import (
	"golang-project/config"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateBannersController(c *gin.Context) {
	type req struct {
		Title  string `json:"title" binding:"required"`
		Image  string `json:"image" binding:"required"`
		Status bool   `json:"status" binding:"required"`
	}

	var request req
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	query := `INSERT INTO banners (title, image, status) VALUES ($1, $2, $3) RETURNING id`
	var productId int
	err := config.DB.QueryRow(query, request.Title, request.Image, request.Status).Scan(&productId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create banners", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":   "Banner created successfully",
		"banner_id": productId,
	})
}
