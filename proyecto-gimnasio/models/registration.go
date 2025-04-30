package models
import "gorm.io/gorm"
type Registration struct {
	gorm.Model
	UserID     uint
	ActivityID uint
  }