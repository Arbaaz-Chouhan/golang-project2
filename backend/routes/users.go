package routes

import (
	"golang-project/controllers"

	"github.com/gin-gonic/gin"
)

func UsersRoutes(r *gin.Engine) {
	r.POST("/user/register", controllers.RegisterUserController)
}
