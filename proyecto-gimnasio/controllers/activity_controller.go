package controllers

import (
    "net/http"
    "proyecto-gimnasio/models"
    "proyecto-gimnasio/services"

    "github.com/gin-gonic/gin"
)

func CreateActivity(c *gin.Context) {
    var activity models.Activity

    if err := c.ShouldBindJSON(&activity); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
        return
    }

    err := services.CreateActivity(activity)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear la actividad"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Actividad creada correctamente"})
}

func ListActivities(c *gin.Context) {
    activities, err := services.GetAllActivities()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener las actividades"})
        return
    }

    c.JSON(http.StatusOK, activities)
}

func GetActivityByID(c *gin.Context) {
    id := c.Param("id")
    activity, err := services.GetActivityByID(id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"})
        return
    }
    c.JSON(http.StatusOK, activity)
}
