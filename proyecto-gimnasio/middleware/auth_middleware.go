package middleware

import (
    "net/http"
    "os"
    "strings"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(role string) gin.HandlerFunc {
    return func(c *gin.Context) {
        tokenHeader := c.GetHeader("Authorization")
        if tokenHeader == "" {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Token required"})
            c.Abort()
            return
        }

        tokenStr := strings.Replace(tokenHeader, "Bearer ", "", 1)
        token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
            return []byte(os.Getenv("JWT_SECRET")), nil
        })

        if err != nil || !token.Valid {
            c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        claims, ok := token.Claims.(jwt.MapClaims)
        if !ok || claims["role"] != role {
            c.JSON(http.StatusForbidden, gin.H{"error": "Forbidden access"})
            c.Abort()
            return
        }

        c.Next()
    }
}
