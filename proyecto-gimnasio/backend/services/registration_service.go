package services

import (
	"fmt"
	"proyecto-gimnasio/config"
	"proyecto-gimnasio/models"
)

func RegisterUserToActivity(userID, activityID uint) error {
	db := config.ConnectDB()

	// verificar si ya está inscripto
	var existing models.Registration
	if err := db.Where("user_id = ? AND activity_id = ?", userID, activityID).First(&existing).Error; err == nil {
		return fmt.Errorf("Ya estás inscripto en esta actividad")
	}

	// contar inscriptos actuales
	var count int64
	db.Model(&models.Registration{}).Where("activity_id = ?", activityID).Count(&count)

	var activity models.Activity
	if err := db.First(&activity, activityID).Error; err != nil {
		return err
	}

	if int(count) >= activity.Capacity {
		return fmt.Errorf("La actividad ya está completa")
	}

	inscription := models.Registration{
		UserID:     userID,
		ActivityID: activityID,
	}
	return db.Create(&inscription).Error
}

func GetActivitiesByUser(userID string) ([]models.Activity, error) {
	db := config.ConnectDB()
	var activities []models.Activity

	result := db.Joins("JOIN registrations ON registrations.activity_id = activities.id").
		Where("registrations.user_id = ?", userID).
		Find(&activities)

	return activities, result.Error
}
