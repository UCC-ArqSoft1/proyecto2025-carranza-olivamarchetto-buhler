package controllers

import (
	"net/http"
	"strconv"

	"proyecto-gimnasio/dto"
	"proyecto-gimnasio/services"

	"github.com/gin-gonic/gin"
)

// EnrollUserInActivity godoc
// @Summary      Inscribir usuario en una actividad
// @Tags         Inscripciones
// @Accept       json
// @Produce      json
// @Param        enrollment  body  object{activity_id=int}  true  "Solo activity_id (user_id viene del token)"
// @Success      201  {object}  dto.RegistrationResponse
// @Failure      400  {object}  map[string]string
// @Failure      401  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /activities/enroll [post]
func EnrollUserInActivity(c *gin.Context) {
	// Obtener user_id del contexto (del middleware de auth)
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no autenticado"})
		return
	}
	userID := userIDInterface.(uint)

	// Solo necesitamos activity_id del JSON
	var req struct {
		ActivityID uint `json:"activity_id" binding:"required,gt=0"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Crear registration con el user_id del token
	reg := dto.ToRegistrationModel(dto.RegistrationRequest{
		UserID:     userID,
		ActivityID: req.ActivityID,
	})
	
	created, err := services.RegisterUserToActivity(reg)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudo registrar la inscripción"})
		return
	}

	c.JSON(http.StatusCreated, dto.ToRegistrationResponse(created))
}

// GetUserActivities godoc
// @Summary      Ver actividades de un usuario
// @Tags         Inscripciones
// @Produce      json
// @Param        user_id  path  int  true  "ID del usuario"
// @Success      200  {array}  dto.ActivityResponse
// @Failure      400  {object}  map[string]string
// @Failure      401  {object}  map[string]string
// @Failure      403  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /users/{user_id}/activities [get]
func GetUserActivities(c *gin.Context) {
	// Obtener user_id del path
	idStr := c.Param("user_id")
	requestedUserID, err := strconv.Atoi(idStr)
	if err != nil || requestedUserID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id inválido"})
		return
	}

	// Obtener información del usuario autenticado
	currentUserIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no autenticado"})
		return
	}
	currentUserID := currentUserIDInterface.(uint)
	
	roleInterface, exists := c.Get("role")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Rol no encontrado"})
		return
	}
	role := roleInterface.(string)

	// Validar permisos: solo el propio usuario o admin
	if role != "admin" && uint(requestedUserID) != currentUserID {
		c.JSON(http.StatusForbidden, gin.H{"error": "No tienes permisos para ver las actividades de otro usuario"})
		return
	}

	acts, err := services.GetActivitiesByUser(uint(requestedUserID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudieron obtener las actividades del usuario"})
		return
	}
	c.JSON(http.StatusOK, dto.ToActivityResponses(acts))
}

// UnenrollFromActivity godoc
// @Summary      Desinscribirse de una actividad
// @Tags         Inscripciones
// @Produce      json
// @Param        id  path  int  true  "ID de la actividad"
// @Success      200  {object}  map[string]string
// @Failure      400  {object}  map[string]string
// @Failure      404  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /activities/{id}/unenroll [delete]
func UnenrollFromActivity(c *gin.Context) {
	// Obtener activity_id del path
	idStr := c.Param("id")
	activityID, err := strconv.Atoi(idStr)
	if err != nil || activityID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de actividad inválido"})
		return
	}

	// Obtener user_id del contexto (del middleware de auth)
	userIDInterface, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuario no autenticado"})
		return
	}
	userID := userIDInterface.(uint)

	// Desinscribir usuario
	err = services.UnenrollUserFromActivity(userID, uint(activityID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Desinscripción exitosa"})
}

// GetActivityEnrollments godoc
// @Summary      Ver usuarios inscritos en una actividad (solo admin)
// @Tags         Inscripciones
// @Produce      json
// @Param        id  path  int  true  "ID de la actividad"
// @Success      200  {array}  dto.UserResponse
// @Failure      400  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /activities/{id}/enrollments [get]
func GetActivityEnrollments(c *gin.Context) {
	// Obtener activity_id del path
	idStr := c.Param("id")
	activityID, err := strconv.Atoi(idStr)
	if err != nil || activityID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID de actividad inválido"})
		return
	}

	// Obtener usuarios inscritos
	users, err := services.GetUsersByActivity(uint(activityID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "No se pudieron obtener los usuarios inscritos"})
		return
	}

	c.JSON(http.StatusOK, dto.ToUserResponses(users))
}
