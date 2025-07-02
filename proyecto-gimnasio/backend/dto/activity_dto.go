package dto

import "proyecto-gimnasio/models"

// ---------- REQUEST DTO ----------

// ActivityRequest representa el JSON que llega cuando se crea o actualiza
// una actividad.
//
// Ejemplo:
// {
//   "name":        "Spinning Avanzado",
//   "day":         "Lunes",
//   "start_hour":  "18:30",
//   "duration":    60,
//   "capacity":    20,
//   "category_id": 1,
//   "frequency":   "Semanal",
//   "image_url":   "https://cdn.example.com/spinning.jpg"
// }
type ActivityRequest struct {
	Name       string `json:"name"        binding:"required,min=3"`
	Day        string `json:"day"         binding:"required,oneof=Lunes Martes Miercoles Jueves Viernes Sabado Domingo"`
	StartHour  string `json:"start_hour"  binding:"required,len=5"`                   // "HH:MM"
	Duration   uint   `json:"duration"    binding:"required,gt=0"`
	Capacity   int    `json:"capacity"    binding:"required,gt=0"`
	CategoryID uint   `json:"category_id" binding:"required,gt=0"`
	Frequency  string `json:"frequency"   binding:"required,oneof=Semanal Mensual Unica"`
	ImageURL   string `json:"image_url"   binding:"omitempty,url"`
}

// ---------- RESPONSE DTO ----------

// ActivityResponse expone la información pública de una actividad.
// Incluye de forma opcional la categoría anidada.
type ActivityResponse struct {
	ID         uint             `json:"id"`
	Name       string           `json:"name"`
	Day        string           `json:"day"`
	StartHour  string           `json:"start_hour"`
	Duration   uint             `json:"duration"`
	Capacity   int              `json:"capacity"`
	CategoryID uint             `json:"category_id"`
	Category   *CategoryResponse`json:"category,omitempty"` // ← nil si no precargas
	Frequency  string           `json:"frequency"`
	ImageURL   string           `json:"image_url,omitempty"`
}

// ---------- MAPPERS ----------

// ToActivityModel convierte el DTO de entrada en la entidad de dominio.
func ToActivityModel(r ActivityRequest) models.Activity {
	return models.Activity{
		Name:       r.Name,
		Day:        r.Day,
		StartHour:  r.StartHour,
		Duration:   r.Duration,
		Capacity:   r.Capacity,
		CategoryID: r.CategoryID,
		Frequency:  r.Frequency,
		ImageURL:   r.ImageURL,
	}
}

// ToActivityResponse oculta campos internos antes de responder.
// Si el modelo trae la categoría precargada (`Preload("Category")`),
// también la mapea.
func ToActivityResponse(a models.Activity) ActivityResponse {
	var cat *CategoryResponse
	if a.Category.ID != 0 {
		c := ToCategoryResponse(a.Category)
		cat = &c
	}
	return ActivityResponse{
		ID:         a.ID,
		Name:       a.Name,
		Day:        a.Day,
		StartHour:  a.StartHour,
		Duration:   a.Duration,
		Capacity:   a.Capacity,
		CategoryID: a.CategoryID,
		Category:   cat,
		Frequency:  a.Frequency,
		ImageURL:   a.ImageURL,
	}
}

// ToActivityResponses convierte un slice de modelos.
func ToActivityResponses(list []models.Activity) []ActivityResponse {
	out := make([]ActivityResponse, len(list))
	for i, a := range list {
		out[i] = ToActivityResponse(a)
	}
	return out
}
