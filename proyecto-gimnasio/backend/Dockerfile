FROM golang:1.24.1-alpine

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN ls -la /app/cmd  # <-- línea opcional de depuración

RUN go build -o main ./cmd/

CMD ["/app/main"]
