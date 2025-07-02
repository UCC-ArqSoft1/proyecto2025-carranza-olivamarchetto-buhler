package controllers

import (
	"net/http"

	"proyecto-gimnasio/dto"
	"proyecto-gimnasio/services"

	"github.com/gin-gonic/gin"
)

// RegisterUser godoc
// @Summary      Registrar nuevo usuario
// @Tags         Autenticación
// @Accept       json
// @Produce      json
// @Param        user  body  dto.UserRequest  true  "Datos del usuario"
// @Success      201  {object}  dto.UserResponse
// @Failure      400  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /register [post]
func RegisterUser(c *gin.Context) {
	var req dto.UserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := dto.ToUserModel(req)

	created, err := services.CreateUser(user) // ← ahora recibe (user, err)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo crear el usuario"})
		return
	}

	c.JSON(http.StatusCreated, dto.ToUserResponse(created))
}
