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
func GetActivityByID(id string) (models.Activity, error) {
    db := config.ConnectDB()
    var activity models.Activity
    result := db.First(&activity, id)
    return activity, result.Error
}

