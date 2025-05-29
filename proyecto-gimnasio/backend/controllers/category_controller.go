package controllers

import (
	"net/http"
	"proyecto-gimnasio/config"
	"proyecto-gimnasio/models"

	"github.com/gin-gonic/gin"
)

// ListCategories godoc
// @Summary Listar todas las categorías
// @Tags Categorías
// @Produce json
// @Success 200 {array} models.SwaggerCategory
// @Failure 500 {object} map[string]string
// @Router /categories [get]
func ListCategories(c *gin.Context) {
	db := config.ConnectDB()
	var categories []models.Category

	if err := db.Find(&categories).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener las categorías"})
		return
	}

	c.JSON(http.StatusOK, categories)
}

// CreateCategory godoc
// @Summary Crear una nueva categoría
// @Tags Categorías
// @Accept json
// @Produce json
// @Param category body models.SwaggerCategory true "Datos de la categoría"
// @Success 201 {object} models.SwaggerCategory
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /categories [post]
func CreateCategory(c *gin.Context) {
	db := config.ConnectDB()
	var category models.Category

	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	if err := db.Create(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo crear la categoría"})
		return
	}

	c.JSON(http.StatusCreated, category)
}

// UpdateCategory godoc
// @Summary Actualizar una categoría
// @Tags Categorías
// @Accept json
// @Produce json
// @Param id path int true "ID de la categoría"
// @Param category body models.SwaggerCategory true "Datos actualizados"
// @Success 200 {object} models.SwaggerCategory
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /categories/{id} [put]
func UpdateCategory(c *gin.Context) {
	db := config.ConnectDB()
	id := c.Param("id")

	var existing models.Category
	if err := db.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Categoría no encontrada"})
		return
	}

	var updated models.Category
	if err := c.ShouldBindJSON(&updated); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Datos inválidos"})
		return
	}

	existing.Name = updated.Name

	if err := db.Save(&existing).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo actualizar la categoría"})
		return
	}

	c.JSON(http.StatusOK, existing)
}

// DeleteCategory godoc
// @Summary Eliminar una categoría
// @Tags Categorías
// @Produce json
// @Param id path int true "ID de la categoría"
// @Success 200 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /categories/{id} [delete]
func DeleteCategory(c *gin.Context) {
	db := config.ConnectDB()
	id := c.Param("id")

	var category models.Category
	if err := db.First(&category, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Categoría no encontrada"})
		return
	}

	if err := db.Delete(&category).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo eliminar la categoría"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Categoría eliminada"})
}
