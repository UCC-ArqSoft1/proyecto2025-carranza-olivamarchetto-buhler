package services

import (
	"crypto/sha256"
	"encoding/hex"
	"github.com/golang-jwt/jwt/v5"
	"os"
	"time"
)

func HashPassword(password string) string {
	hash := sha256.Sum256([]byte(password))
	return hex.EncodeToString(hash[:])
}
  
  func GenerateToken(username, role string) (string, error) {
	claims := jwt.MapClaims{
	  "username": username,
	  "role":     role,
	  "exp":      time.Now().Add(time.Hour * 72).Unix(),
	}
  
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(os.Getenv("JWT_SECRET")))
  }
  