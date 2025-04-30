package main

import (
	"fmt"
	"proyecto-gimnasio/config"
	"proyecto-gimnasio/routes"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
)

func main() {
	db := config.ConnectDB()
	fmt.Println("Base de datos conectada:", db)

	// Crear instancia de router Gin
	router := gin.Default()
    
	router.Use(cors.Default())

	// Configurar rutas
	routes.SetupRoutes(router)

	// Iniciar servidor en el puerto 8080
	err := router.Run(":8080")
	if err != nil {
		fmt.Println("Error al iniciar el servidor:", err)
	}
}
