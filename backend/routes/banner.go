package routes

import (
	"golang-project/controllers"

	"github.com/gin-gonic/gin"
)

func BannerRoutes(r *gin.Engine) {
	r.POST("/banner/add", controllers.CreateBannersController)
}
