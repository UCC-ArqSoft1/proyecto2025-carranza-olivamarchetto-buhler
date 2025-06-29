package services

import (
	"proyecto-gimnasio/config"
	"proyecto-gimnasio/models"
)

func CreateCategory(category models.Category) error {
	db := config.ConnectDB()
	result := db.Create(&category)
	return result.Error
}

func GetAllCategories() ([]models.Category, error) {
	db := config.ConnectDB()
	var categories []models.Category
	result := db.Find(&categories)
	return categories, result.Error
}

func GetCategoryByID(id string) (models.Category, error) {
	db := config.ConnectDB()
	var category models.Category
	result := db.First(&category, id)
	return category, result.Error
}

func UpdateCategory(id string, updated models.Category) error {
	db := config.ConnectDB()
	var category models.Category

	if err := db.First(&category, id).Error; err != nil {
		return err
	}

	category.Name = updated.Name
	return db.Save(&category).Error
}

func DeleteCategory(id string) error {
	db := config.ConnectDB()
	return db.Delete(&models.Category{}, id).Error
} 