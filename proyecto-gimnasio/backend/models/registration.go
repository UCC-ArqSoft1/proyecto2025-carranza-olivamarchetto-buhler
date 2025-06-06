package models

import "gorm.io/gorm"

// swagger:model Registration
type Registration struct {
	gorm.Model
	// ID del usuario
	// required: true
	UserID uint `json:"user_id"`
	// ID de la actividad
	// required: true
	ActivityID uint `json:"activity_id"`
	
}
