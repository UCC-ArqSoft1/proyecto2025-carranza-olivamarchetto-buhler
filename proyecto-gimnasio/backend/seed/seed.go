package seed

import (
	"fmt"
	"proyecto-gimnasio/config"
	"proyecto-gimnasio/models"
	"proyecto-gimnasio/services"
)

func SeedAdminUser() {
	db := config.ConnectDB()

	var count int64
	db.Model(&models.User{}).Where("username = ?", "admin").Count(&count)

	if count > 0 {
		fmt.Println("[Seed] Usuario admin ya existe.")
		return
	}

	user := models.User{
		Username: "admin",
		Password: services.HashPassword("pepe1234"),
		Role:     models.RoleAdmin,
	}

	if err := db.Create(&user).Error; err != nil {
		fmt.Println("[Seed] Error al crear admin:", err)
		return
	}

	fmt.Println("[Seed] Usuario admin creado correctamente.")
}
