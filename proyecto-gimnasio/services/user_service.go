package services

import (
    "proyecto-gimnasio/config"
    "proyecto-gimnasio/models"
)

func CreateUser(user models.User) error {
    db := config.ConnectDB()
    user.Password = HashPassword(user.Password) // esta viene de auth_service.go
    result := db.Create(&user)
    return result.Error
}
