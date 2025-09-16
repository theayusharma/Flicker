package routes

import (
	"backendGo/internal/handler"
	"backendGo/middleware"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func ProjectRoutes(app *fiber.App, db *gorm.DB) {
	authMiddleware := middleware.NewAuthMiddleware(db)

	project := app.Group("/projects")
	project.Use(authMiddleware.RequireAuth)

	project.Get("/", handler.GetProject)
	project.Post("/", handler.CreateProject)
}
