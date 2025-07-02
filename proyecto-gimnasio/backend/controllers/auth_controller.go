package controllers

import (
	"net/http"
	"errors"
	"proyecto-gimnasio/dto"
	"proyecto-gimnasio/services"

	"github.com/gin-gonic/gin"
)

// Login godoc
// @Summary      Iniciar sesión
// @Tags         Autenticación
// @Accept       json
// @Produce      json
// @Param        credentials  body  dto.LoginRequest  true  "Credenciales de usuario"
// @Success      200  {object}  dto.LoginResponse
// @Failure      400  {object}  map[string]string
// @Failure      401  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /login [post]
func Login(c *gin.Context) {
	var creds dto.LoginRequest
	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := services.Authenticate(creds.Username, creds.Password)
	switch {
    case err == nil:
        c.JSON(http.StatusOK, dto.LoginResponse{Message: "Login exitoso", Token: token})
    case errors.Is(err, services.ErrUserNotFound):
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no encontrado"})
    case errors.Is(err, services.ErrBadPassword):
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Contraseña incorrecta"})
    default:
        c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo iniciar sesión"})
    }
}
