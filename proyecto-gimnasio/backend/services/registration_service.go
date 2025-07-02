package services

import (
	"fmt"
	"proyecto-gimnasio/config"
	"proyecto-gimnasio/models"
)

func RegisterUserToActivity(reg models.Registration) (models.Registration, error) {
	db := config.ConnectDB()

	// Usar transacción para evitar condiciones de carrera
	tx := db.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// Verificar si ya está inscripto
	var tmp models.Registration
	if err := tx.Where("user_id = ? AND activity_id = ?", reg.UserID, reg.ActivityID).
		First(&tmp).Error; err == nil {
		tx.Rollback()
		return reg, fmt.Errorf("ya inscripto")
	}

	// Obtener la actividad con lock para lectura
	var act models.Activity
	if err := tx.Set("gorm:query_option", "FOR UPDATE").First(&act, reg.ActivityID).Error; err != nil {
		tx.Rollback()
		return reg, fmt.Errorf("actividad no encontrada: %v", err)
	}

	// Contar inscripciones activas (sin soft deletes)
	var count int64
	tx.Model(&models.Registration{}).Where("activity_id = ?", reg.ActivityID).Count(&count)

	// Verificar capacidad
	if int(count) >= act.Capacity {
		tx.Rollback()
		return reg, fmt.Errorf("actividad completa (ocupada: %d/%d)", count, act.Capacity)
	}

	// Crear la inscripción
	if err := tx.Create(&reg).Error; err != nil {
		tx.Rollback()
		return reg, fmt.Errorf("error al crear inscripción: %v", err)
	}

	// Confirmar transacción
	if err := tx.Commit().Error; err != nil {
		return reg, fmt.Errorf("error al confirmar inscripción: %v", err)
	}

	return reg, nil
}

func GetActivitiesByUser(userID uint) ([]models.Activity, error)  {
	db := config.ConnectDB()
	var activities []models.Activity

	result := db.Distinct("activities.*").
		Joins("JOIN registrations ON registrations.activity_id = activities.id").
		Where("registrations.user_id = ? AND registrations.deleted_at IS NULL", userID).
		Preload("Category").
		Find(&activities)

	return activities, result.Error
}

// UnenrollUserFromActivity elimina la inscripción de un usuario a una actividad
func UnenrollUserFromActivity(userID, activityID uint) error {
	db := config.ConnectDB()
	
	// Verificar que existe la inscripción activa
	var registration models.Registration
	if err := db.Where("user_id = ? AND activity_id = ?", userID, activityID).
		First(&registration).Error; err != nil {
		return fmt.Errorf("inscripción no encontrada: %v", err)
	}

	// Usar soft delete normal (consistente con el Count() en RegisterUserToActivity)
	if err := db.Delete(&registration).Error; err != nil {
		return fmt.Errorf("error al eliminar inscripción: %v", err)
	}

	return nil
}

// GetUsersByActivity obtiene todos los usuarios inscritos activamente en una actividad
func GetUsersByActivity(activityID uint) ([]models.User, error) {
	db := config.ConnectDB()
	var users []models.User

	result := db.Distinct("users.*").
		Joins("JOIN registrations ON registrations.user_id = users.id").
		Where("registrations.activity_id = ? AND registrations.deleted_at IS NULL", activityID).
		Find(&users)

	return users, result.Error
}
