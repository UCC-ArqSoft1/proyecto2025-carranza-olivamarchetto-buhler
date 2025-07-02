package controllers

import (
	"net/http"
	"strconv"

	"proyecto-gimnasio/services"

	"github.com/gin-gonic/gin"
)

// GetActivityStats godoc
// @Summary      Obtener estadísticas de todas las actividades
// @Description  Retorna estadísticas detalladas de todas las actividades incluyendo ocupación, cupos disponibles, etc.
// @Tags         Estadísticas
// @Produce      json
// @Success      200  {array}   dto.ActivityStatsResponse
// @Failure      500  {object}  map[string]string
// @Router       /admin/stats/activities [get]
func GetActivityStats(c *gin.Context) {
	stats, err := services.GetActivityStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener estadísticas de actividades"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

// GetUserStats godoc
// @Summary      Obtener estadísticas de usuarios
// @Description  Retorna estadísticas generales del sistema de usuarios: totales por rol, activos/inactivos
// @Tags         Estadísticas
// @Produce      json
// @Success      200  {object}  dto.UserStatsResponse
// @Failure      500  {object}  map[string]string
// @Router       /admin/stats/users [get]
func GetUserStats(c *gin.Context) {
	stats, err := services.GetUserStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener estadísticas de usuarios"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

// GetEnrollmentStats godoc
// @Summary      Obtener estadísticas de inscripciones
// @Description  Retorna estadísticas generales de inscripciones: totales, promedios, días populares
// @Tags         Estadísticas
// @Produce      json
// @Success      200  {object}  dto.EnrollmentStatsResponse
// @Failure      500  {object}  map[string]string
// @Router       /admin/stats/enrollments [get]
func GetEnrollmentStats(c *gin.Context) {
	stats, err := services.GetEnrollmentStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener estadísticas de inscripciones"})
		return
	}

	c.JSON(http.StatusOK, stats)
}

// GetPopularActivities godoc
// @Summary      Obtener actividades más populares
// @Description  Retorna las actividades ordenadas por número de inscripciones (ranking)
// @Tags         Estadísticas
// @Produce      json
// @Param        limit  query  int  false  "Límite de resultados (default: 10)"
// @Success      200  {array}   dto.PopularActivityResponse
// @Failure      400  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /admin/stats/popular-activities [get]
func GetPopularActivities(c *gin.Context) {
	// Obtener parámetro limit (opcional)
	limitStr := c.Query("limit")
	limit := 10 // Por defecto

	if limitStr != "" {
		if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 {
			limit = parsedLimit
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Parámetro 'limit' inválido"})
			return
		}
	}

	activities, err := services.GetPopularActivities(limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener actividades populares"})
		return
	}

	c.JSON(http.StatusOK, activities)
}

// GetDayStats godoc
// @Summary      Obtener estadísticas por día de la semana
// @Description  Retorna estadísticas agrupadas por día de la semana
// @Tags         Estadísticas
// @Produce      json
// @Success      200  {array}   dto.DayStatsResponse
// @Failure      500  {object}  map[string]string
// @Router       /admin/stats/days [get]
func GetDayStats(c *gin.Context) {
	stats, err := services.GetDayStats()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener estadísticas por día"})
		return
	}

	c.JSON(http.StatusOK, stats)
} 