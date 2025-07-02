package services

import (
	"fmt"
	"proyecto-gimnasio/config"
	"proyecto-gimnasio/models"
)

func RegisterUserToActivity(reg models.Registration) (models.Registration, error) {
	db := config.ConnectDB()

	// exists?
	var tmp models.Registration
	if err := db.Where("user_id = ? AND activity_id = ?", reg.UserID, reg.ActivityID).
		First(&tmp).Error; err == nil {
		return reg, fmt.Errorf("ya inscripto")
	}

	// cupo
	var count int64
	db.Model(&models.Registration{}).Where("activity_id = ?", reg.ActivityID).Count(&count)

	var act models.Activity
	if err := db.First(&act, reg.ActivityID).Error; err != nil {
		return reg, err
	}
	if int(count) >= act.Capacity {
		return reg, fmt.Errorf("actividad completa")
	}

	return reg, db.Create(&reg).Error
}

func GetActivitiesByUser(userID uint) ([]models.Activity, error)  {
	db := config.ConnectDB()
	var activities []models.Activity

	result := db.Joins("JOIN registrations ON registrations.activity_id = activities.id").
		Where("registrations.user_id = ?", userID).
		Preload("Category").
		Find(&activities)

	return activities, result.Error
}
