// services/auth_service.go
package services

import (
	"errors"
	"os"
	"time"

	"proyecto-gimnasio/config"
	"proyecto-gimnasio/models"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrUserNotFound  = errors.New("not_found")
	ErrBadPassword   = errors.New("bad_password")
)

// bcrypt hash
func HashPassword(pwd string) string {
	hash, _ := bcrypt.GenerateFromPassword([]byte(pwd), bcrypt.DefaultCost)
	return string(hash)
}

// compara y genera JWT
func Authenticate(username, plainPwd string) (string, error) {
	db := config.ConnectDB()

	var user models.User
	if err := db.Where("username = ?", username).First(&user).Error; err != nil {
        return "", ErrUserNotFound
	}
	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(plainPwd)) != nil {
        return "", ErrBadPassword
	}
	return GenerateToken(user.ID, user.Username, string(user.Role))
}

func GenerateToken(id uint, username, role string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": id,
		"username": username,
		"role": role,
		"exp": time.Now().Add(15 * time.Minute).Unix(),
	}
	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return tok.SignedString([]byte(os.Getenv("JWT_SECRET")))
}
