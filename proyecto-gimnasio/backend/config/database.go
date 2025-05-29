package config

import (
	"fmt"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"proyecto-gimnasio/models" // Importá tus modelos (ajustá si el path es diferente)
)

func ConnectDB() *gorm.DB {
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?parseTime=true",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_NAME"),
	)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic(err)
	}

	// AutoMigrate crea las tablas si no existen
	err = db.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Activity{},
		&models.Registration{},
	)

	if err != nil {
		panic("Failed to migrate database: " + err.Error())
	}

	return db
}
