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

func UpdateActivity(id string, updated models.Activity) error {
    db := config.ConnectDB()
    var activity models.Activity

    if err := db.First(&activity, id).Error; err != nil {
        return err
    }

    activity.Name = updated.Name
    activity.Day = updated.Day
    activity.Hour = updated.Hour
    activity.Capacity = updated.Capacity
    activity.Category = updated.Category

    return db.Save(&activity).Error
}
func DeleteActivity(id string) error {
    db := config.ConnectDB()
    return db.Delete(&models.Activity{}, id).Error
}
