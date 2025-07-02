package services

import (
    "proyecto-gimnasio/config"
    "proyecto-gimnasio/models"
)

func CreateUser(u models.User) (models.User, error) {
	db := config.ConnectDB()
	u.Password = HashPassword(u.Password)
	return u, db.Create(&u).Error
}
