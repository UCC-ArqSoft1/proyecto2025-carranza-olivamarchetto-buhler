package routes

import (
    "github.com/gin-gonic/gin"
    "proyecto-gimnasio/controllers"
    "proyecto-gimnasio/middleware"
)

func SetupRoutes(router *gin.Engine) {
    router.POST("/login", controllers.Login)

    admin := router.Group("/admin").Use(middleware.AuthMiddleware("admin"))
    {
        admin.POST("/activities", controllers.CreateActivity)
    }

    router.GET("/activities", controllers.ListActivities)
	router.POST("/register", controllers.RegisterUser)

}
