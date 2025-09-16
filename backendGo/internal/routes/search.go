package routes

import (
	"backendGo/internal/handler"
	"backendGo/middleware"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func SearchRoutes(c *fiber.App, db *gorm.DB) {
	authMiddleware := middleware.NewAuthMiddleware(db)

	app := c.Group("/search")
	app.Use(authMiddleware.RequireAuth)

	app.Get("/", handler.Search)
}
