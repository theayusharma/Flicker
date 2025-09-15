package main

import (
	"backendGo/internal/routes"
	"backendGo/pkg/database"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	// "github.com/joho/godotenv"
)

func main() {
	app := fiber.New()

	url := os.Getenv("FRONT_URL")
	// if url == "" {
	// 	url = "http://localhost:3000"
	// }

	app.Use(cors.New(cors.Config{
		AllowOrigins:  url, // frontend origin
		AllowMethods:  "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:  "Origin, Content-Type, Accept, Authorization",
		ExposeHeaders: "Content-Length",
		// AllowCredentials: true,
	}))

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("hello go cat")
	})
	routes.TaskRoutes(app)
	routes.ProjectRoutes(app)
	routes.SearchRoutes(app)
	routes.Users(app)
	routes.Teams(app)

	database.InitDB()
	db := database.GetDB()
	routes.SetupAuthRoutes(app, db)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}
	log.Fatal(app.Listen(":" + port))
}
