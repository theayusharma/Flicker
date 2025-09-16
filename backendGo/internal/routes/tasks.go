package routes

import (
	"backendGo/internal/handler"
	"backendGo/middleware"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func TaskRoutes(app *fiber.App, db *gorm.DB) {
	authMiddleware := middleware.NewAuthMiddleware(db)

	task := app.Group("/tasks")
	task.Use(authMiddleware.RequireAuth)

	task.Get("/", handler.GetTasks)
	task.Post("/", handler.CreateTask)
	task.Patch("/:id/status", handler.UpdateTaskStatus)
}
