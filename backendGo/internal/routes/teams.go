package routes

import (
	"backendGo/internal/handler"
	"backendGo/middleware"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Teams(app *fiber.App, db *gorm.DB) {
	authMiddleware := middleware.NewAuthMiddleware(db)

	route := app.Group("/teams")
	route.Use(authMiddleware.RequireAuth)

	route.Get("/", handler.Teams)
}
