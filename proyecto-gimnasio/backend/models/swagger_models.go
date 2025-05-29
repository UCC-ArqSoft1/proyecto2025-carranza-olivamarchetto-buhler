package models

// SwaggerActivity representa una estructura simplificada para documentación Swagger
// swagger:model SwaggerActivity
type SwaggerActivity struct {
	ID         uint   `json:"id"`
	Name       string `json:"name"`
	Day        string `json:"day"`
	StartHour  string `json:"start_hour"`
	Duration   uint   `json:"duration"`
	Capacity   int    `json:"capacity"`
	CategoryID uint   `json:"category_id"`
	Frequency  string `json:"frequency"`
	ImageURL   string `json:"image_url"`
}

// swagger:model SwaggerCategory
type SwaggerCategory struct {
	ID   uint   `json:"id"`
	Name string `json:"name"`
}

// swagger:model SwaggerUser
type SwaggerUser struct {
	ID       uint   `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

// swagger:model SwaggerRegistration
type SwaggerRegistration struct {
	ID         uint `json:"id"`
	UserID     uint `json:"user_id"`
	ActivityID uint `json:"activity_id"`
}
