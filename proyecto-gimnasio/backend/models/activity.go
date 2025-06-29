package models

import "gorm.io/gorm"

// swagger:model Activity
type Activity struct {
	gorm.Model
	// Nombre de la actividad
	// required: true
	Name string `json:"name"`
	// Día de la semana (Lunes a Domingo)
	// required: true
	Day string `json:"day"`
	// Hora de inicio (HH:MM)
	// required: true
	StartHour string `json:"start_hour"`
	// Duración en minutos
	// required: true
	Duration uint `json:"duration"`
	// Cupo máximo
	// required: true
	Capacity int `json:"capacity"`
	// ID de categoría relacionada
	// required: true
	CategoryID uint `json:"category_id"`
	// Relación con la categoría
	Category Category `json:"category" gorm:"foreignKey:CategoryID"`
	// Frecuencia: Semanal, Mensual o Única
	// required: true
	Frequency string `json:"frequency"`
	// URL de imagen
	// required: false
	ImageURL string `json:"image_url"`
}
