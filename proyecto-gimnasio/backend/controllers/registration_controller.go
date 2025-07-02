package controllers

import (
	"net/http"
	"strconv"

	"proyecto-gimnasio/dto"
	"proyecto-gimnasio/services"

	"github.com/gin-gonic/gin"
)

// EnrollUserInActivity godoc
// @Summary      Inscribir usuario en una actividad
// @Tags         Inscripciones
// @Accept       json
// @Produce      json
// @Param        enrollment  body  dto.RegistrationRequest  true  "user_id y activity_id"
// @Success      201  {object}  dto.RegistrationResponse
// @Failure      400  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /activities/enroll [post]
func EnrollUserInActivity(c *gin.Context) {
	var req dto.RegistrationRequest
	if err := c.ShouldBindJSON(&req); err != nil { // validator v10 corre detrás
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	reg := dto.ToRegistrationModel(req)
	created, err := services.RegisterUserToActivity(reg) // cambia la firma del service
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo registrar la inscripción"})
		return
	}

	c.JSON(http.StatusCreated, dto.ToRegistrationResponse(created))
}

// GetUserActivities godoc
// @Summary      Ver actividades de un usuario
// @Tags         Inscripciones
// @Produce      json
// @Param        user_id  path  int  true  "ID del usuario"
// @Success      200  {array}  dto.ActivityResponse
// @Failure      400  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /users/{user_id}/activities [get]
func GetUserActivities(c *gin.Context) {
	idStr := c.Param("user_id")
	uid, err := strconv.Atoi(idStr)
	if err != nil || uid <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id inválido"})
		return
	}

	acts, err := services.GetActivitiesByUser(uint(uid))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudieron obtener las actividades del usuario"})
		return
	}
	c.JSON(http.StatusOK, dto.ToActivityResponses(acts))
}
