package routes

import (
    "github.com/gin-gonic/gin"
    "proyecto-gimnasio/controllers"
    "proyecto-gimnasio/middleware"
)

func SetupRoutes(router *gin.Engine) {
    // ========== RUTAS PÚBLICAS ==========
    router.POST("/login", controllers.Login)
    router.POST("/register", controllers.RegisterUser)
    router.GET("/activities", controllers.ListActivities)
    router.GET("/activities/:id", controllers.GetActivityByID)
    router.GET("/categories", controllers.ListCategories)

    // ========== RUTAS PARA USUARIOS AUTENTICADOS ==========
    authenticated := router.Group("/").Use(middleware.AuthMiddleware(""))
    {
        authenticated.POST("/activities/enroll", controllers.EnrollUserInActivity)
        authenticated.GET("/users/:user_id/activities", controllers.GetUserActivities)
        authenticated.DELETE("/activities/:id/unenroll", controllers.UnenrollFromActivity)
    }

    // ========== RUTAS SOLO PARA ADMIN ==========
    admin := router.Group("/admin").Use(middleware.AuthMiddleware("admin"))
    {
        // Gestión de actividades
        admin.POST("/activities", controllers.CreateActivity)
        admin.PUT("/activities/:id", controllers.UpdateActivity)
        admin.DELETE("/activities/:id", controllers.DeleteActivity)
        admin.GET("/activities/:id/enrollments", controllers.GetActivityEnrollments)
        
        // Gestión de categorías
        admin.POST("/categories", controllers.CreateCategory)
        admin.PUT("/categories/:id", controllers.UpdateCategory)
        admin.DELETE("/categories/:id", controllers.DeleteCategory)
    }

}
