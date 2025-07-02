package dto

import "proyecto-gimnasio/models"

// ---------- REQUEST DTO ----------

// CategoryRequest representa el JSON que llega al crear o actualizar
// una categoría.
//
// Ejemplo de cuerpo:
// {
//   "name": "Spinning"
// }
type CategoryRequest struct {
	Name string `json:"name" binding:"required,min=3"`
}

// ---------- RESPONSE DTO ----------

// CategoryResponse es la forma pública que enviamos al cliente.
type CategoryResponse struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

// ---------- MAPPERS ----------

// ToCategoryModel convierte el DTO de entrada en la entidad de dominio.
func ToCategoryModel(r CategoryRequest) models.Category {
	return models.Category{
		Name: r.Name,
	}
}

// ToCategoryResponse oculta campos de Gorm antes de responder.
func ToCategoryResponse(cat models.Category) CategoryResponse {
	return CategoryResponse{
		ID:   cat.ID,
		Name: cat.Name,
	}
}

// Si necesitas un slice:
// func ToCategoryResponses(cats []models.Category) []CategoryResponse { ... }
// dto/category_dto.go (al final del archivo)
func ToCategoryResponses(cats []models.Category) []CategoryResponse {
	out := make([]CategoryResponse, len(cats))
	for i, c := range cats {
		out[i] = ToCategoryResponse(c)
	}
	return out
}
