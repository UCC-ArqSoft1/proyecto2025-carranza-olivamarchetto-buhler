package controllers

import (
    "net/http"
    "proyecto-gimnasio/models"
    "proyecto-gimnasio/services"

    "github.com/gin-gonic/gin"
)

// RegisterUser godoc
// @Summary Registrar nuevo usuario
// @Tags Autenticación
// @Accept json
// @Produce json
// @Param user body models.SwaggerUser true "Datos del usuario"
// @Success 201 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /register [post]
func RegisterUser(c *gin.Context) {
    var user models.User

    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
        return
    }

    if user.Role != "admin" && user.Role != "socio" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "El rol debe ser 'admin' o 'socio'"})
        return
    }

    err := services.CreateUser(user)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo crear el usuario"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Usuario creado con éxito"})
}
