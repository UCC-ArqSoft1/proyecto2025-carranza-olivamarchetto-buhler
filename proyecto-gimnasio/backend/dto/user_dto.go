package dto

import (
	"proyecto-gimnasio/models"

	"github.com/go-playground/validator/v10"
)


// Reutilizamos el enum de roles del modelo
type UserRole = models.UserRole

// UserRequest para crear/actualizar usuarios
type UserRequest struct {
    Username string   `json:"username" binding:"required"`
    Password string   `json:"password" binding:"required,min=8"`
    Role     UserRole `json:"role"     binding:"required,oneof=admin socio"`
}

// UserResponse que enviamos al cliente (sin password)
type UserResponse struct {
    ID       uint     `json:"id"`
    Username string   `json:"username"`
    Role     UserRole `json:"role"`
}

// Mapeadores

// ToUserModel traduce el DTO a tu entidad Gorm (hash en el service)
func ToUserModel(r UserRequest) models.User {
    return models.User{
        Username: r.Username,
        Password: r.Password,
        Role:     r.Role,
    }
}

// ToUserResponse oculta el password y metadatos de Gorm
func ToUserResponse(u models.User) UserResponse {
    return UserResponse{
        ID:       u.ID,
        Username: u.Username,
        Role:     u.Role,
    }
}

// ToUserResponses convierte un slice de modelos User a respuestas
func ToUserResponses(users []models.User) []UserResponse {
    out := make([]UserResponse, len(users))
    for i, u := range users {
        out[i] = ToUserResponse(u)
    }
    return out
}

// ---------- ADMIN USER MANAGEMENT DTOs ----------

// UserUpdateRequest para que admin actualice cualquier usuario
type UserUpdateRequest struct {
    Username string   `json:"username" binding:"required"`
    Role     UserRole `json:"role"     binding:"required,oneof=admin socio"`
}

// ---------- USER PROFILE DTOs ----------

// ProfileResponse información completa del perfil (sin password)
type ProfileResponse struct {
    ID       uint     `json:"id"`
    Username string   `json:"username"`
    Role     UserRole `json:"role"`
    // Aquí se pueden agregar más campos del perfil en el futuro
}

// ProfileUpdateRequest para actualizar perfil propio
type ProfileUpdateRequest struct {
    Username string `json:"username" binding:"required"`
}

// ChangePasswordRequest para cambiar contraseña
type ChangePasswordRequest struct {
    CurrentPassword string `json:"current_password" binding:"required"`
    NewPassword     string `json:"new_password"     binding:"required,min=8"`
}

// ---------- MAPPERS ADICIONALES ----------

// ToProfileResponse convierte User a ProfileResponse
func ToProfileResponse(u models.User) ProfileResponse {
    return ProfileResponse{
        ID:       u.ID,
        Username: u.Username,
        Role:     u.Role,
    }
}

// ---------- VALIDATOR INIT (opcional) ----------

// RegisterCustomValidators se llama una sola vez (p. ej., en main.go) para
// añadir validadores propios; aquí un ejemplo si más adelante quisieras
// validar el DNI argentino.
func RegisterCustomValidators(v *validator.Validate) error {
	// v.RegisterValidation("dni", validateDNI)
	return nil
}
