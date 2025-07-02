package dto

import "proyecto-gimnasio/models"

// ---------- REQUEST DTO ----------

// RegistrationRequest representa el cuerpo JSON que llega a
// POST /registrations  (o el endpoint que uses para inscribir).
type RegistrationRequest struct {
	UserID     uint `json:"user_id"     binding:"required,gt=0"`
	ActivityID uint `json:"activity_id" binding:"required,gt=0"`
}

// ---------- RESPONSE DTO ----------

// RegistrationResponse es la forma pública que devuelves al cliente.
// No expone campos internos de gorm.Model (CreatedAt, UpdatedAt, etc.).
type RegistrationResponse struct {
	ID         uint `json:"id"`
	UserID     uint `json:"user_id"`
	ActivityID uint `json:"activity_id"`
}

// ---------- MAPPERS ----------

// ToRegistrationModel convierte el DTO de entrada en la entidad de dominio.
// Si necesitas lógica extra (p. ej. verificar cupos), hazlo en el service.
func ToRegistrationModel(r RegistrationRequest) models.Registration {
	return models.Registration{
		UserID:     r.UserID,
		ActivityID: r.ActivityID,
	}
}

// ToRegistrationResponse oculta campos internos antes de responder.
func ToRegistrationResponse(reg models.Registration) RegistrationResponse {
	return RegistrationResponse{
		ID:         reg.ID,
		UserID:     reg.UserID,
		ActivityID: reg.ActivityID,
	}
}
