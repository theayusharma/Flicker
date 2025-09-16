package routes

import (
	"backendGo/internal/handler"
	"backendGo/middleware"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Users(app *fiber.App, db *gorm.DB) {
	authMiddleware := middleware.NewAuthMiddleware(db)

	user := app.Group("/user")
	user.Use(authMiddleware.RequireAuth)

	user.Get("/", handler.GetUsers)

}
