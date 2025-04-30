package models

import "gorm.io/gorm"

type Activity struct {
	gorm.Model
	Name     string `json:"name"`
	Day      string `json:"day"`
	Hour     string `json:"hour"`
	Capacity int    `json:"capacity"`
	Category string `json:"category"`
}

