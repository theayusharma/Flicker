package handler

import (
	"backendGo/internal/models"
	"backendGo/pkg/database"

	// "strconv"

	"github.com/gofiber/fiber/v2"
)

func GetUsers(c *fiber.Ctx) error {
	// var users []models.User
	// if err := database.DB.Debug().Find(&users).Error; err != nil {
	// 	return c.Status(500).JSON(fiber.Map{"messsage": "error in giving users" + err.Error()})
	// }
	// return c.JSON(users)

	// Multi-user enabled version
	user := c.Locals("user").(models.User)
	var users []models.User
	if user.TeamID != nil {
		if err := database.DB.Debug().Where("team_id = ?", *user.TeamID).Find(&users).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"message": "error retrieving team members: " + err.Error()})
		}
	} else {
		// If user has no team, only return the user themselves
		userID := c.Locals("userID").(uint)
		if err := database.DB.Debug().Where("user_id = ?", userID).Find(&users).Error; err != nil {
			return c.Status(500).JSON(fiber.Map{"message": "error retrieving user: " + err.Error()})
		}
	}
	return c.JSON(users)
}
