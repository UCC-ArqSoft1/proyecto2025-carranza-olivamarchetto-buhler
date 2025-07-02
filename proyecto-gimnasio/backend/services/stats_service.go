package services

import (
	"proyecto-gimnasio/config"
	"proyecto-gimnasio/dto"
	"proyecto-gimnasio/models"
)

// GetActivityStats obtiene estadísticas detalladas de todas las actividades
func GetActivityStats() ([]dto.ActivityStatsResponse, error) {
	db := config.ConnectDB()
	var results []dto.ActivityStatsResponse

	query := `
		SELECT 
			a.id as activity_id,
			a.name as activity_name,
			c.name as category_name,
			a.day,
			a.start_hour,
			a.capacity,
			COALESCE(COUNT(r.id), 0) as current_enrolled,
			(a.capacity - COALESCE(COUNT(r.id), 0)) as available_spots,
			CASE 
				WHEN a.capacity > 0 THEN (COALESCE(COUNT(r.id), 0) * 100.0 / a.capacity)
				ELSE 0 
			END as occupancy_rate
		FROM activities a
		LEFT JOIN categories c ON a.category_id = c.id
		LEFT JOIN registrations r ON a.id = r.activity_id AND r.deleted_at IS NULL
		WHERE a.deleted_at IS NULL
		GROUP BY a.id, a.name, c.name, a.day, a.start_hour, a.capacity
		ORDER BY a.name
	`

	if err := db.Raw(query).Scan(&results).Error; err != nil {
		return nil, err
	}

	return results, nil
}

// GetUserStats obtiene estadísticas generales de usuarios
func GetUserStats() (dto.UserStatsResponse, error) {
	db := config.ConnectDB()
	var stats dto.UserStatsResponse

	// Total de usuarios activos
	var totalUsers int64
	db.Model(&models.User{}).Where("deleted_at IS NULL").Count(&totalUsers)
	stats.TotalUsers = int(totalUsers)

	// Usuarios por rol (solo activos)
	var adminCount, socioCount int64
	db.Model(&models.User{}).Where("role = ? AND deleted_at IS NULL", "admin").Count(&adminCount)
	db.Model(&models.User{}).Where("role = ? AND deleted_at IS NULL", "socio").Count(&socioCount)
	stats.TotalAdmins = int(adminCount)
	stats.TotalSocios = int(socioCount)

	// Usuarios activos (con al menos 1 inscripción activa)
	var activeCount int64
	db.Model(&models.User{}).
		Joins("JOIN registrations ON users.id = registrations.user_id AND registrations.deleted_at IS NULL").
		Distinct("users.id").
		Count(&activeCount)
	stats.ActiveUsers = int(activeCount)

	// Usuarios inactivos
	stats.InactiveUsers = stats.TotalUsers - stats.ActiveUsers

	return stats, nil
}

// GetEnrollmentStats obtiene estadísticas de inscripciones
func GetEnrollmentStats() (dto.EnrollmentStatsResponse, error) {
	db := config.ConnectDB()
	var stats dto.EnrollmentStatsResponse

	// Total de inscripciones activas (sin soft delete)
	var totalEnrollments int64
	db.Model(&models.Registration{}).Where("deleted_at IS NULL").Count(&totalEnrollments)
	stats.TotalEnrollments = int(totalEnrollments)

	// Promedio de inscripciones por usuario activo
	var activeUsers int64
	db.Model(&models.User{}).
		Joins("JOIN registrations ON users.id = registrations.user_id AND registrations.deleted_at IS NULL").
		Distinct("users.id").
		Count(&activeUsers)
	
	if activeUsers > 0 {
		stats.AveragePerUser = float64(totalEnrollments) / float64(activeUsers)
	}

	// Promedio de inscripciones por actividad activa
	var totalActivities int64
	db.Model(&models.Activity{}).Where("deleted_at IS NULL").Count(&totalActivities)
	
	if totalActivities > 0 {
		stats.AveragePerActivity = float64(totalEnrollments) / float64(totalActivities)
	}

	// Día más y menos popular
	type DayCount struct {
		Day   string
		Count int
	}

	var dayCounts []DayCount
	db.Model(&models.Registration{}).
		Select("activities.day, COUNT(*) as count").
		Joins("JOIN activities ON registrations.activity_id = activities.id").
		Where("activities.deleted_at IS NULL AND registrations.deleted_at IS NULL").
		Group("activities.day").
		Order("count DESC").
		Scan(&dayCounts)

	if len(dayCounts) > 0 {
		stats.MostPopularDay = dayCounts[0].Day
		stats.LeastPopularDay = dayCounts[len(dayCounts)-1].Day
	}

	return stats, nil
}

// GetPopularActivities obtiene las actividades más populares ordenadas por inscripciones
func GetPopularActivities(limit int) ([]dto.PopularActivityResponse, error) {
	if limit <= 0 {
		limit = 10 // Límite por defecto
	}

	db := config.ConnectDB()
	var results []dto.PopularActivityResponse

	query := `
		SELECT 
			a.id as activity_id,
			a.name as activity_name,
			c.name as category_name,
			a.day,
			a.start_hour,
			COALESCE(COUNT(r.id), 0) as enrollment_count,
			a.capacity,
			CASE 
				WHEN a.capacity > 0 THEN (COALESCE(COUNT(r.id), 0) * 100.0 / a.capacity)
				ELSE 0 
			END as occupancy_rate
		FROM activities a
		LEFT JOIN categories c ON a.category_id = c.id
		LEFT JOIN registrations r ON a.id = r.activity_id AND r.deleted_at IS NULL
		WHERE a.deleted_at IS NULL
		GROUP BY a.id, a.name, c.name, a.day, a.start_hour, a.capacity
		ORDER BY enrollment_count DESC, occupancy_rate DESC
		LIMIT ?
	`

	if err := db.Raw(query, limit).Scan(&results).Error; err != nil {
		return nil, err
	}

	// Agregar ranking
	for i := range results {
		results[i].Rank = i + 1
	}

	return results, nil
}

// GetDayStats obtiene estadísticas por día de la semana
func GetDayStats() ([]dto.DayStatsResponse, error) {
	db := config.ConnectDB()
	var results []dto.DayStatsResponse

	// Días de la semana en orden
	days := []string{"Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"}

	for _, day := range days {
		var dayStats dto.DayStatsResponse
		dayStats.Day = day

		// Total de actividades activas en este día
		var activityCount int64
		db.Model(&models.Activity{}).Where("day = ? AND deleted_at IS NULL", day).Count(&activityCount)
		dayStats.TotalActivities = int(activityCount)

		// Total de inscripciones activas en actividades de este día
		var enrollmentCount int64
		db.Model(&models.Registration{}).
			Joins("JOIN activities ON registrations.activity_id = activities.id").
			Where("activities.day = ? AND activities.deleted_at IS NULL AND registrations.deleted_at IS NULL", day).
			Count(&enrollmentCount)
		dayStats.TotalEnrollments = int(enrollmentCount)

		results = append(results, dayStats)
	}

	return results, nil
} 