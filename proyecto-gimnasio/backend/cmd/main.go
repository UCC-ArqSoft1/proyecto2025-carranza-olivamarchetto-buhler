// @title Proyecto Gimnasio API
// @version 1.0
// @description API para la gestión de un gimnasio.
// @termsOfService http://swagger.io/terms/
// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @host localhost:8080
// @BasePath /

package main

import (
	"fmt"
	"proyecto-gimnasio/config"
	"proyecto-gimnasio/routes"
	"proyecto-gimnasio/seed"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/swaggo/gin-swagger"
	swaggerFiles "github.com/swaggo/files"
	_ "proyecto-gimnasio/docs"
	"github.com/joho/godotenv"
	"log"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	db := config.ConnectDB()
	seed.SeedAdminUser()
	fmt.Println("Base de datos conectada:", db)

	// Crear instancia de router Gin
	router := gin.Default()
	router.Static("/images", "./uploads")
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "http://localhost:3001"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Configurar rutas
	routes.SetupRoutes(router)

	// Iniciar servidor en el puerto 8080
	err = router.Run(":8080")
	if err != nil {
		fmt.Println("Error al iniciar el servidor:", err)
	}
}
