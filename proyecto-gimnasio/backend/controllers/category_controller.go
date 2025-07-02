package controllers

import (
	"net/http"
	"strconv"

	"proyecto-gimnasio/dto"
	"proyecto-gimnasio/services"

	"github.com/gin-gonic/gin"
)

// ListCategories godoc
// @Summary      Listar todas las categorías
// @Tags         Categorías
// @Produce      json
// @Success      200  {array}  dto.CategoryResponse
// @Failure      500  {object}  map[string]string
// @Router       /categories [get]
func ListCategories(c *gin.Context) {
	cats, err := services.GetAllCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener las categorías"})
		return
	}
	c.JSON(http.StatusOK, dto.ToCategoryResponses(cats))
}

// CreateCategory godoc
// @Summary      Crear una nueva categoría
// @Tags         Categorías
// @Accept       json
// @Produce      json
// @Param        category  body  dto.CategoryRequest  true  "Datos de la categoría"
// @Success      201  {object}  dto.CategoryResponse
// @Failure      400  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /categories [post]
func CreateCategory(c *gin.Context) {
	var req dto.CategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil { // validator v10 corre detrás
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cat := dto.ToCategoryModel(req)
	created, err := services.CreateCategory(cat)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo crear la categoría"})
		return
	}
	c.JSON(http.StatusCreated, dto.ToCategoryResponse(created))
}

// UpdateCategory godoc
// @Summary      Actualizar una categoría
// @Tags         Categorías
// @Accept       json
// @Produce      json
// @Param        id        path  int                  true  "ID de la categoría"
// @Param        category  body  dto.CategoryRequest  true  "Datos actualizados"
// @Success      200  {object}  dto.CategoryResponse
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /categories/{id} [put]
func UpdateCategory(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	var req dto.CategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cat := dto.ToCategoryModel(req)
	updated, err := services.UpdateCategory(uint(id), cat)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo actualizar la categoría"})
		return
	}
	c.JSON(http.StatusOK, dto.ToCategoryResponse(updated))
}

// DeleteCategory godoc
// @Summary      Eliminar una categoría
// @Tags         Categorías
// @Produce      json
// @Param        id  path  int  true  "ID de la categoría"
// @Success      200  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /categories/{id} [delete]
func DeleteCategory(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	if err := services.DeleteCategory(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo eliminar la categoría"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Categoría eliminada"})
}
