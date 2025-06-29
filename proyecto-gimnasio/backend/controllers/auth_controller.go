package controllers

import (
	"net/http"
	"proyecto-gimnasio/config"
	"proyecto-gimnasio/models"
	"proyecto-gimnasio/services"

	"github.com/gin-gonic/gin"
)

// Login godoc
// @Summary Iniciar sesión
// @Tags Autenticación
// @Accept json
// @Produce json
// @Param credentials body models.SwaggerUser true "Credenciales de usuario"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /login [post]
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
	token, err := services.GenerateToken(user.ID, user.Username, string(user.Role)) // ✅
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo generar el token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login exitoso",
		"token":   token,
	})
}
