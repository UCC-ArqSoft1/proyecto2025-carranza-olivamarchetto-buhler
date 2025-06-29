package controllers

import (
    "net/http"
    "proyecto-gimnasio/services"

    "github.com/gin-gonic/gin"
)

// EnrollUserInActivity godoc
// @Summary Inscribir usuario en una actividad
// @Tags Inscripciones
// @Accept json
// @Produce json
// @Param inscripcion body object true "user_id y activity_id"
// @Success 201 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /activities/enroll [post]
func EnrollUserInActivity(c *gin.Context) {
    var input struct {
        UserID     uint `json:"user_id"`
        ActivityID uint `json:"activity_id"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
        return
    }

    err := services.RegisterUserToActivity(input.UserID, input.ActivityID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo registrar la inscripción"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Inscripción exitosa"})
}

// GetUserActivities godoc
// @Summary Ver actividades de un usuario
// @Tags Inscripciones
// @Produce json
// @Param user_id path int true "ID del usuario"
// @Success 200 {array} models.SwaggerActivity
// @Failure 500 {object} map[string]string
// @Router /users/{user_id}/activities [get]
func GetUserActivities(c *gin.Context) {
    userID := c.Param("user_id")
    activities, err := services.GetActivitiesByUser(userID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudieron obtener las actividades del usuario"})
        return
    }
    c.JSON(http.StatusOK, activities)
}
