package handler

import (
	"backendGo/internal/models"
	"backendGo/pkg/database"

	"github.com/gofiber/fiber/v2"
)

type SafeUserResponse struct {
	UserID            uint   `json:"user_id"`
	Username          string `json:"username"`
	Email             string `json:"email,omitempty"`
	GithubUsername    string `json:"github_username,omitempty"`
	ProfilePictureURL string `json:"profile_picture_url,omitempty"`
	TeamID            *uint  `json:"team_id,omitempty"`
}

func getStringValue(ptr *string) string {
	if ptr == nil {
		return ""
	}
	return *ptr
}

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

	safeUsers := make([]SafeUserResponse, len(users))
	for i, u := range users {
		safeUsers[i] = SafeUserResponse{
			UserID:            u.UserID,
			Username:          u.Username,
			Email:             getStringValue(u.Email),
			GithubUsername:    getStringValue(u.GithubUsername),
			ProfilePictureURL: getStringValue(u.ProfilePictureURL),
			TeamID:            u.TeamID,
		}
	}

	return c.JSON(safeUsers)
}
