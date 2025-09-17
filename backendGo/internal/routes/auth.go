package routes

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"backendGo/internal/handler"
)

func SetupAuthRoutes(app *fiber.App, db *gorm.DB) {
	authHandler := handler.NewAuthHandler(db)

	auth := app.Group("/api/auth")

	auth.Post("/google", authHandler.GoogleAuth)
	auth.Post("/signup", authHandler.Signup)
	auth.Post("/login", authHandler.Login)
}
