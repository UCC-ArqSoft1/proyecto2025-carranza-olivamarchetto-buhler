// services/activity_service.go
package services

import (
	"proyecto-gimnasio/config"
	"proyecto-gimnasio/models"
)

func CreateActivity(a models.Activity) (models.Activity, error) {
	db := config.ConnectDB()
	if err := db.Create(&a).Error; err != nil {
		return a, err
	}
	return a, nil
}

func GetAllActivities() ([]models.Activity, error) {
	db := config.ConnectDB()
	var list []models.Activity
	err := db.Preload("Category").Find(&list).Error
	return list, err
}

func GetActivityByID(id uint) (models.Activity, error) {
	db := config.ConnectDB()
	var act models.Activity
	err := db.Preload("Category").First(&act, id).Error
	return act, err
}

func UpdateActivity(id uint, upd models.Activity) (models.Activity, error) {
	db := config.ConnectDB()
	var act models.Activity
	if err := db.First(&act, id).Error; err != nil {
		return act, err
	}

	// copy campos
	act.Name       = upd.Name
	act.Day        = upd.Day
	act.StartHour  = upd.StartHour
	act.Duration   = upd.Duration
	act.Capacity   = upd.Capacity
	act.CategoryID = upd.CategoryID
	act.Frequency  = upd.Frequency
	act.ImageURL   = upd.ImageURL

	return act, db.Save(&act).Error
}

func DeleteActivity(id uint) error {
	db := config.ConnectDB()
	return db.Delete(&models.Activity{}, id).Error
}
