package controllers

import (
	"net/http"
	"proyecto-gimnasio/services"
	"proyecto-gimnasio/models"
	"proyecto-gimnasio/config"
	"github.com/gin-gonic/gin"
)

func Login(c *gin.Context) {
	var input models.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	db := config.ConnectDB()
	var user models.User
	result := db.Where("username = ?", input.Username).First(&user)
	if result.Error != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no encontrado"})
		return
	}

	hashed := services.HashPassword(input.Password)
	if hashed != user.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Contraseña incorrecta"})
		return
	}

	// ✅ Generar token
	token, err := services.GenerateToken(user.Username, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo generar el token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login exitoso",
		"token":   token,
	})
}
