package controllers

import (
    "github.com/gin-gonic/gin"
    "net/http"
    // otros imports
)

func Login(c *gin.Context) {
    // lógica de login
    c.JSON(http.StatusOK, gin.H{"message": "Login exitoso"})
}
