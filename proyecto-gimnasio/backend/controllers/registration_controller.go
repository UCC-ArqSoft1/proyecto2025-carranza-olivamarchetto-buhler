package controllers

import (
    "net/http"
    "proyecto-gimnasio/services"

    "github.com/gin-gonic/gin"
)

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
func GetUserActivities(c *gin.Context) {
    userID := c.Param("user_id")
    activities, err := services.GetActivitiesByUser(userID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudieron obtener las actividades del usuario"})
        return
    }
    c.JSON(http.StatusOK, activities)
}
