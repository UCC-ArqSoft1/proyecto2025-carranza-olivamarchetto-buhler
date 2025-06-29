

package controllers

import (
    "net/http"
    "proyecto-gimnasio/models"
    "proyecto-gimnasio/services"

    "github.com/gin-gonic/gin"
)

// CreateActivity godoc
// @Summary Crear una nueva actividad
// @Tags Actividades
// @Accept json
// @Produce json
// @Param activity body models.SwaggerActivity true "Datos de la actividad"
// @Success 201 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /admin/activities [post]
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

// ListActivities godoc
// @Summary Listar todas las actividades
// @Tags Actividades
// @Produce json
// @Success 200 {array} models.SwaggerActivity
// @Failure 500 {object} map[string]string
// @Router /activities [get]
func ListActivities(c *gin.Context) {
    activities, err := services.GetAllActivities()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener las actividades"})
        return
    }

    c.JSON(http.StatusOK, activities)
}

// GetActivityByID godoc
// @Summary Obtener una actividad por ID
// @Tags Actividades
// @Produce json
// @Param id path int true "ID de la actividad"
// @Success 200 {object} models.SwaggerActivity
// @Failure 404 {object} map[string]string
// @Router /activities/{id} [get]
func GetActivityByID(c *gin.Context) {
    id := c.Param("id")
    activity, err := services.GetActivityByID(id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"})
        return
    }
    c.JSON(http.StatusOK, activity)
}

// UpdateActivity godoc
// @Summary Actualizar una actividad existente
// @Tags Actividades
// @Accept json
// @Produce json
// @Param id path int true "ID de la actividad"
// @Param activity body models.SwaggerActivity true "Datos actualizados"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /admin/activities/{id} [put]
func UpdateActivity(c *gin.Context) {
    id := c.Param("id")
    var updatedData models.Activity

    if err := c.ShouldBindJSON(&updatedData); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
        return
    }

    err := services.UpdateActivity(id, updatedData)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo actualizar la actividad"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Actividad actualizada con éxito"})
}

// DeleteActivity godoc
// @Summary Eliminar una actividad
// @Tags Actividades
// @Produce json
// @Param id path int true "ID de la actividad"
// @Success 200 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /admin/activities/{id} [delete]
func DeleteActivity(c *gin.Context) {
    id := c.Param("id")

    err := services.DeleteActivity(id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo eliminar la actividad"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Actividad eliminada con éxito"})
}
