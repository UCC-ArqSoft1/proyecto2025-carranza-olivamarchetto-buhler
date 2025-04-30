package services

import (
    "proyecto-gimnasio/config"
    "proyecto-gimnasio/models"
)

func RegisterUserToActivity(userID, activityID uint) error {
    db := config.ConnectDB()
    inscription := models.Registration{
        UserID:     userID,
        ActivityID: activityID,
    }
    result := db.Create(&inscription)
    return result.Error
}

func GetActivitiesByUser(userID string) ([]models.Activity, error) {
    db := config.ConnectDB()
    var activities []models.Activity

    result := db.Joins("JOIN registrations ON registrations.activity_id = activities.id").
        Where("registrations.user_id = ?", userID).
        Find(&activities)

    return activities, result.Error
}
