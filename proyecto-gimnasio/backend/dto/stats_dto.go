package dto

// ---------- STATS RESPONSE DTOs ----------

// ActivityStatsResponse representa estadísticas de una actividad específica
type ActivityStatsResponse struct {
	ActivityID      uint   `json:"activity_id"`
	ActivityName    string `json:"activity_name"`
	CategoryName    string `json:"category_name"`
	Day             string `json:"day"`
	StartHour       string `json:"start_hour"`
	Capacity        int    `json:"capacity"`
	CurrentEnrolled int    `json:"current_enrolled"`
	AvailableSpots  int    `json:"available_spots"`
	OccupancyRate   float64`json:"occupancy_rate"` // Porcentaje de ocupación
}

// UserStatsResponse representa estadísticas generales de usuarios
type UserStatsResponse struct {
	TotalUsers       int `json:"total_users"`
	TotalAdmins      int `json:"total_admins"`
	TotalSocios      int `json:"total_socios"`
	ActiveUsers      int `json:"active_users"`      // Usuarios con al menos 1 inscripción
	InactiveUsers    int `json:"inactive_users"`    // Usuarios sin inscripciones
}

// EnrollmentStatsResponse representa estadísticas de inscripciones
type EnrollmentStatsResponse struct {
	TotalEnrollments    int     `json:"total_enrollments"`
	AveragePerUser      float64 `json:"average_per_user"`
	AveragePerActivity  float64 `json:"average_per_activity"`
	MostPopularDay      string  `json:"most_popular_day"`
	LeastPopularDay     string  `json:"least_popular_day"`
}

// PopularActivityResponse representa una actividad popular con sus estadísticas
type PopularActivityResponse struct {
	ActivityID       uint    `json:"activity_id"`
	ActivityName     string  `json:"activity_name"`
	CategoryName     string  `json:"category_name"`
	Day              string  `json:"day"`
	StartHour        string  `json:"start_hour"`
	EnrollmentCount  int     `json:"enrollment_count"`
	Capacity         int     `json:"capacity"`
	OccupancyRate    float64 `json:"occupancy_rate"`
	Rank             int     `json:"rank"` // Posición en el ranking
}

// DayStatsResponse representa estadísticas por día de la semana
type DayStatsResponse struct {
	Day             string `json:"day"`
	TotalActivities int    `json:"total_activities"`
	TotalEnrollments int   `json:"total_enrollments"`
} 