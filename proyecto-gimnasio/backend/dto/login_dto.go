package dto

// LoginRequest contiene las credenciales para POST /login
type LoginRequest struct {
    Username string `json:"username" binding:"required"`
    Password string `json:"password" binding:"required,min=8"`
}

// LoginResponse devuelve el mensaje y el token al cliente
type LoginResponse struct {
    Message string `json:"message"`
    Token   string `json:"token"`
}
