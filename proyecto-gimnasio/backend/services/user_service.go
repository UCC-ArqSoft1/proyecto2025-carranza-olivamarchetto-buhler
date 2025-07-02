package services

import (
	"errors"
	"fmt"
	"proyecto-gimnasio/config"
	"proyecto-gimnasio/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// CreateUser crea un nuevo usuario (registro)
func CreateUser(u models.User) (models.User, error) {
	db := config.ConnectDB()
	u.Password = HashPassword(u.Password)
	return u, db.Create(&u).Error
}

// GetAllUsers obtiene todos los usuarios (solo admin)
func GetAllUsers() ([]models.User, error) {
	db := config.ConnectDB()
	var users []models.User
	err := db.Where("deleted_at IS NULL").Find(&users).Error
	return users, err
}

// GetUserByID obtiene un usuario por ID
func GetUserByID(id uint) (models.User, error) {
	db := config.ConnectDB()
	var user models.User
	err := db.Where("deleted_at IS NULL").First(&user, id).Error
	return user, err
}

// UpdateUser actualiza un usuario (admin)
func UpdateUser(id uint, updateData models.User) (models.User, error) {
	db := config.ConnectDB()
	
	var user models.User
	if err := db.Where("deleted_at IS NULL").First(&user, id).Error; err != nil {
		return user, err
	}

	// Verificar que el username no esté en uso por otro usuario
	var existingUser models.User
	if err := db.Where("username = ? AND id != ? AND deleted_at IS NULL", updateData.Username, id).First(&existingUser).Error; err == nil {
		return user, fmt.Errorf("el username '%s' ya está en uso", updateData.Username)
	}

	// Actualizar campos
	user.Username = updateData.Username
	user.Role = updateData.Role

	return user, db.Save(&user).Error
}

// DeleteUser elimina un usuario (soft delete)
func DeleteUser(id uint) error {
	db := config.ConnectDB()
	
	var user models.User
	if err := db.Where("deleted_at IS NULL").First(&user, id).Error; err != nil {
		return err
	}

	return db.Delete(&user).Error
}

// UpdateProfile actualiza el perfil propio del usuario
func UpdateProfile(userID uint, updateData models.User) (models.User, error) {
	db := config.ConnectDB()
	
	var user models.User
	if err := db.Where("deleted_at IS NULL").First(&user, userID).Error; err != nil {
		return user, err
	}

	// Verificar que el username no esté en uso por otro usuario
	var existingUser models.User
	if err := db.Where("username = ? AND id != ? AND deleted_at IS NULL", updateData.Username, userID).First(&existingUser).Error; err == nil {
		return user, fmt.Errorf("el username '%s' ya está en uso", updateData.Username)
	}

	// Solo actualizar username (no role)
	user.Username = updateData.Username

	return user, db.Save(&user).Error
}

// ChangePassword cambia la contraseña del usuario
func ChangePassword(userID uint, currentPassword, newPassword string) error {
	db := config.ConnectDB()
	
	var user models.User
	if err := db.Where("deleted_at IS NULL").First(&user, userID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("usuario no encontrado")
		}
		return err
	}

	// Verificar contraseña actual
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(currentPassword)); err != nil {
		return fmt.Errorf("contraseña actual incorrecta")
	}

	// Actualizar con nueva contraseña
	user.Password = HashPassword(newPassword)
	return db.Save(&user).Error
}
