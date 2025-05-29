package models

import (
	"time"

	"gorm.io/gorm"
)

type Frequency string
type WeekDay string

const (
	FrequencySemanal Frequency = "Semanal"
	FrequencyMensual Frequency = "Mensual"
	FrequencyUnica   Frequency = "Unica"

	Monday    WeekDay = "Lunes"
	Tuesday   WeekDay = "Martes"
	Wednesday WeekDay = "Miércoles"
	Thursday  WeekDay = "Jueves"
	Friday    WeekDay = "Viernes"
	Saturday  WeekDay = "Sábado"
	Sunday    WeekDay = "Domingo"
)

type Activity struct {
	gorm.Model
	Name       string    `json:"name"`
	Day        WeekDay   `json:"day" gorm:"type:enum('Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo')"`
	StartHour  time.Time `json:"start_hour"`
	Duration   int       `json:"duration"` // minutos
	Capacity   int       `json:"capacity"`
	CategoryID uint      `json:"category_id"`
	Category   Category  `gorm:"foreignKey:CategoryID"`
	Frequency  Frequency `json:"frequency" gorm:"type:enum('Semanal','Mensual','Unica')"`
	ImageURL   string    `json:"image_url"`
}
