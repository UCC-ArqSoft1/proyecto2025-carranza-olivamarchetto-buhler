package models

import "gorm.io/gorm"

type UserRole string

const (
	RoleAdmin UserRole = "admin"
	RoleSocio UserRole = "socio"
)

type User struct {
	gorm.Model
	Username string   `json:"username" gorm:"unique"`
	Password string   `json:"password"`
	Role     UserRole `json:"role" gorm:"type:enum('admin','socio')"`
}
