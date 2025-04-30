package main

import (
	"fmt"
	"proyecto-gimnasio/config"
	"proyecto-gimnasio/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	db := config.ConnectDB()
	fmt.Println("Base de datos conectada:", db)

	// Crear instancia de router Gin
	router := gin.Default()

	// Configurar rutas
	routes.SetupRoutes(router)

	// Iniciar servidor en el puerto 8080
	err := router.Run(":8080")
	if err != nil {
		fmt.Println("Error al iniciar el servidor:", err)
	}
}
