// services/category_service.go
package services

import (
	"proyecto-gimnasio/config"
	"proyecto-gimnasio/models"
)

func CreateCategory(c models.Category) (models.Category, error) {
	db := config.ConnectDB()
	return c, db.Create(&c).Error
}

func GetAllCategories() ([]models.Category, error) {
	db := config.ConnectDB()
	var list []models.Category
	return list, db.Find(&list).Error
}

func GetCategoryByID(id uint) (models.Category, error) {
	db := config.ConnectDB()
	var cat models.Category
	return cat, db.First(&cat, id).Error
}

func UpdateCategory(id uint, upd models.Category) (models.Category, error) {
	db := config.ConnectDB()
	var cat models.Category
	if err := db.First(&cat, id).Error; err != nil {
		return cat, err
	}
	cat.Name = upd.Name
	return cat, db.Save(&cat).Error
}

func DeleteCategory(id uint) error {
	db := config.ConnectDB()
	return db.Delete(&models.Category{}, id).Error
}
