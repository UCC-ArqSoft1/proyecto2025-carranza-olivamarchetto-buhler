package models

import "gorm.io/gorm"

type Registration struct {
	gorm.Model
	UserID     uint
	User       User `gorm:"foreignKey:UserID"`
	ActivityID uint
	Activity   Activity `gorm:"foreignKey:ActivityID"`
}
