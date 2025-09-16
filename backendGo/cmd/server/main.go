package main

import (
	"backendGo/internal/routes"
	"backendGo/pkg/database"
	"log"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	_ = godotenv.Load()

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOriginsFunc: func(origin string) bool {
			allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
			if allowedOrigins != "" {
				origins := strings.Split(allowedOrigins, ",")
				for _, allowedOrigin := range origins {
					if strings.TrimSpace(allowedOrigin) == origin {
						return true
					}
				}
			}

			return strings.HasSuffix(origin, ".vercel.app") ||
				strings.HasSuffix(origin, ".netlify.app") ||
				origin == "http://localhost:3000" ||
				origin == "http://127.0.0.1:3000"
		},
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Origin,Content-Type,Authorization,Accept",
		AllowCredentials: true,
	}))

	app.Options("/*", func(c *fiber.Ctx) error {
		return c.SendStatus(200)
	})

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("hello go cat")
	})

	db := database.GetDB()

	// (no middleware needed)
	routes.SetupAuthRoutes(app, db)

	routes.TaskRoutes(app, db)
	routes.ProjectRoutes(app, db)
	routes.SearchRoutes(app, db)
	routes.Users(app, db)
	routes.Teams(app, db)

	port := os.Getenv("PORT")
	if port == "" {
		port = "3001"
	}
	log.Fatal(app.Listen(":" + port))
}
