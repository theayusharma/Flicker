package database

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"backendGo/internal/models"
)

var DB *gorm.DB

func InitDB() {

	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	postgresURI := os.Getenv("POSTGRES_URI")
	if postgresURI == "" {
		log.Fatal("POSTGRES_URI environment variable is required")
	}

	var err error
	DB, err = gorm.Open(postgres.Open(postgresURI), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		log.Fatalf("failed to connect to DB: %v", err)
	}

	DB.Exec("SET CONSTRAINTS ALL DEFERRED")
	err = DB.AutoMigrate(
		&models.Team{},
		&models.User{},
		&models.Project{},
		&models.ProjectTeam{},
		&models.Task{},
		&models.TaskAssignment{},
		&models.Attachment{},
		&models.Comment{},
	)
	if err != nil {
		log.Fatalf("failed to AutoMigrate: %v", err)
	}
	log.Println("connected to PostgreSQL successfully")
}

func GetDB() *gorm.DB {
	if DB == nil {
		InitDB()
	}
	return DB
}
