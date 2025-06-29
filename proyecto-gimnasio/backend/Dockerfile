FROM golang:1.24.1-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Instalar versión compatible de swag
RUN go install github.com/swaggo/swag/cmd/swag@v1.16.2
ENV PATH="/go/bin:${PATH}"

# Generar documentación Swagger
RUN swag init -g cmd/main.go -o docs

RUN ls -la /app/cmd  # <-- opcional para depurar estructura

# Compilar el backend
RUN go build -o main ./cmd/

CMD ["/app/main"]
