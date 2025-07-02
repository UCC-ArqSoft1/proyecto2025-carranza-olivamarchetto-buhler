package controllers

import (
	"net/http"
	"strconv"

	"proyecto-gimnasio/dto"
	"proyecto-gimnasio/services"

	"github.com/gin-gonic/gin"
)

// RegisterUser godoc
// @Summary      Registrar nuevo usuario
// @Tags         Autenticación
// @Accept       json
// @Produce      json
// @Param        user  body  dto.UserRequest  true  "Datos del usuario"
// @Success      201  {object}  dto.UserResponse
// @Failure      400  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /register [post]
func RegisterUser(c *gin.Context) {
	var req dto.UserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user := dto.ToUserModel(req)

	created, err := services.CreateUser(user) // ← ahora recibe (user, err)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo crear el usuario"})
		return
	}

	c.JSON(http.StatusCreated, dto.ToUserResponse(created))
}

// ========== ADMIN USER MANAGEMENT ==========

// GetAllUsers godoc
// @Summary      Listar todos los usuarios (solo admin)
// @Tags         Administración de Usuarios
// @Produce      json
// @Success      200  {array}   dto.UserResponse
// @Failure      500  {object}  map[string]string
// @Router       /admin/users [get]
func GetAllUsers(c *gin.Context) {
	users, err := services.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error al obtener usuarios"})
		return
	}

	c.JSON(http.StatusOK, dto.ToUserResponses(users))
}

// UpdateUser godoc
// @Summary      Actualizar usuario (solo admin)
// @Tags         Administración de Usuarios
// @Accept       json
// @Produce      json
// @Param        id    path  int                  true  "ID del usuario"
// @Param        user  body  dto.UserUpdateRequest true  "Datos actualizados"
// @Success      200  {object}  dto.UserResponse
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /admin/users/{id} [put]
func UpdateUser(c *gin.Context) {
	// Obtener ID del path
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de usuario inválido"})
		return
	}

	// Binding del JSON
	var req dto.UserUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Crear modelo para actualización
	updateData := dto.ToUserModel(dto.UserRequest{
		Username: req.Username,
		Role:     req.Role,
		Password: "dummy", // No se actualiza la password aquí
	})

	// Actualizar usuario
	updated, err := services.UpdateUser(uint(id), updateData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, dto.ToUserResponse(updated))
}

// DeleteUser godoc
// @Summary      Eliminar usuario (solo admin)
// @Tags         Administración de Usuarios
// @Produce      json
// @Param        id  path  int  true  "ID del usuario"
// @Success      200  {object}  map[string]string
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /admin/users/{id} [delete]
func DeleteUser(c *gin.Context) {
	// Obtener ID del path
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de usuario inválido"})
		return
	}

	// Obtener user_id del contexto (del middleware de auth)
	currentUserIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no autenticado"})
		return
	}
	currentUserID := currentUserIDInterface.(uint)

	// Prevenir auto-eliminación
	if uint(id) == currentUserID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "No puedes eliminar tu propio usuario"})
		return
	}

	// Eliminar usuario
	if err := services.DeleteUser(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Usuario eliminado con éxito"})
}

// ========== USER PROFILE MANAGEMENT ==========

// GetProfile godoc
// @Summary      Ver perfil propio
// @Tags         Perfil de Usuario
// @Produce      json
// @Success      200  {object}  dto.ProfileResponse
// @Failure      401  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /users/profile [get]
func GetProfile(c *gin.Context) {
	// Obtener user_id del contexto (del middleware de auth)
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no autenticado"})
		return
	}
	userID := userIDInterface.(uint)

	// Obtener usuario
	user, err := services.GetUserByID(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Usuario no encontrado"})
		return
	}

	c.JSON(http.StatusOK, dto.ToProfileResponse(user))
}

// UpdateProfile godoc
// @Summary      Actualizar perfil propio
// @Tags         Perfil de Usuario
// @Accept       json
// @Produce      json
// @Param        profile  body  dto.ProfileUpdateRequest  true  "Datos del perfil"
// @Success      200  {object}  dto.ProfileResponse
// @Failure      400  {object}  map[string]string
// @Failure      401  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /users/profile [put]
func UpdateProfile(c *gin.Context) {
	// Obtener user_id del contexto (del middleware de auth)
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no autenticado"})
		return
	}
	userID := userIDInterface.(uint)

	// Binding del JSON
	var req dto.ProfileUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Crear modelo para actualización (solo username)
	updateData := dto.ToUserModel(dto.UserRequest{
		Username: req.Username,
		Role:     "socio", // Dummy, no se actualiza
		Password: "dummy", // Dummy, no se actualiza
	})

	// Actualizar perfil
	updated, err := services.UpdateProfile(userID, updateData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, dto.ToProfileResponse(updated))
}

// ChangePassword godoc
// @Summary      Cambiar contraseña
// @Tags         Perfil de Usuario
// @Accept       json
// @Produce      json
// @Param        passwords  body  dto.ChangePasswordRequest  true  "Contraseñas"
// @Success      200  {object}  map[string]string
// @Failure      400  {object}  map[string]string
// @Failure      401  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /users/change-password [put]
func ChangePassword(c *gin.Context) {
	// Obtener user_id del contexto (del middleware de auth)
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no autenticado"})
		return
	}
	userID := userIDInterface.(uint)

	// Binding del JSON
	var req dto.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Cambiar contraseña
	if err := services.ChangePassword(userID, req.CurrentPassword, req.NewPassword); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Contraseña actualizada con éxito"})
}
