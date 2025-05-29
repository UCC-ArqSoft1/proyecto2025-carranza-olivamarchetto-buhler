package models

import "gorm.io/gorm"

// swagger:model Category
type Category struct {
	gorm.Model
	// Nombre de la categoría
	// required: true
	Name string `json:"name" gorm:"unique"`
}
