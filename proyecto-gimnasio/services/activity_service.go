package services

import (
    "proyecto-gimnasio/config"
    "proyecto-gimnasio/models"
)

func CreateActivity(activity models.Activity) error {
    db := config.ConnectDB()
    result := db.Create(&activity)
    return result.Error
}

func GetAllActivities() ([]models.Activity, error) {
    db := config.ConnectDB()
    var activities []models.Activity
    result := db.Find(&activities)
    return activities, result.Error
}
