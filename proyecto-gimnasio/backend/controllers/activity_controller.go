package controllers

import (
	"net/http"
	"strconv"

	"proyecto-gimnasio/dto"
	"proyecto-gimnasio/services"

	"github.com/gin-gonic/gin"
)

// ---------------------------------------------------------
// CREATE
// ---------------------------------------------------------

// CreateActivity godoc
// @Summary      Crear una nueva actividad
// @Tags         Actividades
// @Accept       json
// @Produce      json
// @Param        activity  body  dto.ActivityRequest  true  "Datos de la actividad"
// @Success      201  {object}  dto.ActivityResponse
// @Failure      400  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /admin/activities [post]
func CreateActivity(c *gin.Context) {
	var req dto.ActivityRequest
	if err := c.ShouldBindJSON(&req); err != nil { // validator v10
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	act := dto.ToActivityModel(req)
	created, err := services.CreateActivity(act)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al crear la actividad"})
		return
	}
	c.JSON(http.StatusCreated, dto.ToActivityResponse(created))
}

// ---------------------------------------------------------
// LIST
// ---------------------------------------------------------

// ListActivities godoc
// @Summary      Listar todas las actividades
// @Tags         Actividades
// @Produce      json
// @Success      200  {array}  dto.ActivityResponse
// @Failure      500  {object}  map[string]string
// @Router       /activities [get]
func ListActivities(c *gin.Context) {
	acts, err := services.GetAllActivities()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener las actividades"})
		return
	}
	c.JSON(http.StatusOK, dto.ToActivityResponses(acts))
}

// ---------------------------------------------------------
// GET BY ID
// ---------------------------------------------------------

// GetActivityByID godoc
// @Summary      Obtener una actividad por ID
// @Tags         Actividades
// @Produce      json
// @Param        id  path  int  true  "ID de la actividad"
// @Success      200  {object}  dto.ActivityResponse
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Router       /activities/{id} [get]
func GetActivityByID(c *gin.Context) {
	id, err := strToUint(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	act, err := services.GetActivityByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Actividad no encontrada"})
		return
	}
	c.JSON(http.StatusOK, dto.ToActivityResponse(act))
}

// ---------------------------------------------------------
// UPDATE
// ---------------------------------------------------------

// UpdateActivity godoc
// @Summary      Actualizar una actividad existente
// @Tags         Actividades
// @Accept       json
// @Produce      json
// @Param        id       path  int                 true  "ID de la actividad"
// @Param        activity body  dto.ActivityRequest true  "Datos actualizados"
// @Success      200  {object}  dto.ActivityResponse
// @Failure      400  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /admin/activities/{id} [put]
func UpdateActivity(c *gin.Context) {
	id, err := strToUint(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var req dto.ActivityRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	act := dto.ToActivityModel(req)
	updated, err := services.UpdateActivity(id, act)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo actualizar la actividad"})
		return
	}
	c.JSON(http.StatusOK, dto.ToActivityResponse(updated))
}

// ---------------------------------------------------------
// DELETE
// ---------------------------------------------------------

// DeleteActivity godoc
// @Summary      Eliminar una actividad
// @Tags         Actividades
// @Produce      json
// @Param        id  path  int  true  "ID de la actividad"
// @Success      200  {object}  map[string]string
// @Failure      400  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /admin/activities/{id} [delete]
func DeleteActivity(c *gin.Context) {
	id, err := strToUint(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	if err := services.DeleteActivity(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo eliminar la actividad"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Actividad eliminada con éxito"})
}

// ---------------------------------------------------------
// HELPER
// ---------------------------------------------------------

// strToUint convierte string → uint y valida > 0.
func strToUint(s string) (uint, error) {
	val, err := strconv.Atoi(s)
	if err != nil || val <= 0 {
		return 0, err
	}
	return uint(val), nil
}
