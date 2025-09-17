package handler

import (
	"backendGo/internal/models"
	"backendGo/internal/models/dto"
	"backendGo/pkg/database"
	"strconv"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

type SafeTaskUser struct {
	UserID            uint   `json:"user_id"`
	Username          string `json:"username"`
	Email             string `json:"email,omitempty"`
	ProfilePictureURL string `json:"profile_picture_url,omitempty"`
}

type SafeTaskResponse struct {
	ID          uint                `json:"id"`
	CreatedAt   time.Time           `json:"createdat"`
	UpdatedAt   time.Time           `json:"updatedat"`
	Title       string              `json:"title"`
	Description *string             `json:"description"`
	Status      *string             `json:"status"`
	Priority    *string             `json:"priority"`
	Tags        *string             `json:"tags"`
	StartDate   *time.Time          `json:"startdate"`
	DueDate     *time.Time          `json:"duedate"`
	Points      *uint               `json:"points"`
	ProjectID   uint                `json:"projectid"`
	AuthorID    uint                `json:"authorid"`
	AssigneeID  *uint               `json:"assigneeid"`
	Author      SafeTaskUser        `json:"author"`
	Assignee    *SafeTaskUser       `json:"assignee,omitempty"`
	Attachments []models.Attachment `json:"attachments"`
}

func convertToSafeTaskUser(user models.User) SafeTaskUser {
	return SafeTaskUser{
		UserID:            user.UserID,
		Username:          user.Username,
		Email:             getTaskStringValue(user.Email),
		ProfilePictureURL: getTaskStringValue(user.ProfilePictureURL),
	}
}

func getTaskStringValue(ptr *string) string {
	if ptr == nil {
		return ""
	}
	return *ptr
}

func GetTasks(c *fiber.Ctx) error {
	userID := c.Locals("userID").(uint)

	var project_id = c.Query("projectId")
	if project_id == "" {
		return c.Status(400).JSON(fiber.Map{"message": "send a valid projectid broo"})
	}
	projectId, err := strconv.Atoi(project_id)
	// taskId, err := strconv.Atoi(task_id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "invalid projectidddd"})
	}

	var projectCount int64
	database.DB.Table("projects").
		Joins("JOIN project_teams ON projects.project_id = project_teams.project_id").
		Joins("JOIN teams ON project_teams.team_id = teams.team_id").
		Joins("JOIN users ON teams.team_id = users.team_id").
		Where("users.user_id = ? AND projects.project_id = ?", userID, projectId).
		Count(&projectCount)
	if projectCount == 0 {
		return c.Status(403).JSON(fiber.Map{"message": "Access denied to this project"})
	}

	var tasks []models.Task
	if err := database.DB.Debug().Preload("Attachments").
		Preload("Author").
		Preload("Assignee").Where("project_id = ?", projectId).Find(&tasks).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"messsage": "error in giving tasks" + err.Error()})
	}

	safeTasks := make([]SafeTaskResponse, len(tasks))
	for i, task := range tasks {
		safeTask := SafeTaskResponse{
			ID:          task.ID,
			CreatedAt:   task.CreatedAt,
			UpdatedAt:   task.UpdatedAt,
			Title:       task.Title,
			Description: task.Description,
			Status:      task.Status,
			Priority:    task.Priority,
			Tags:        task.Tags,
			StartDate:   task.StartDate,
			DueDate:     task.DueDate,
			Points:      task.Points,
			ProjectID:   task.ProjectID,
			AuthorID:    task.AuthorID,
			AssigneeID:  task.AssigneeID,
			Author:      convertToSafeTaskUser(task.Author),
			Attachments: task.Attachments,
		}

		if task.Assignee != nil {
			safeAssignee := convertToSafeTaskUser(*task.Assignee)
			safeTask.Assignee = &safeAssignee
		}

		safeTasks[i] = safeTask
	}

	return c.JSON(safeTasks)
}

func CreateTask(c *fiber.Ctx) error {
	var input dto.Task

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error invalid request",
			"error":   err.Error(),
		})
	}

	validate := validator.New()
	if err := validate.Struct(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "validation failed",
			"errors":  err.Error(),
		})
	}

	// Get the authenticated user ID
	userID := c.Locals("userID").(uint)

	var startDate, dueDate *time.Time
	if input.StartDate != nil && *input.StartDate != "" {
		if parsed, err := time.Parse("2006-01-02", *input.StartDate); err == nil {
			startDate = &parsed
		}
	}
	if input.DueDate != nil && *input.DueDate != "" {
		if parsed, err := time.Parse("2006-01-02", *input.DueDate); err == nil {
			dueDate = &parsed
		}
	}

	task := models.Task{
		Title:       input.Title,
		Description: input.Description,
		Status:      input.Status,
		Priority:    input.Priority,
		Tags:        input.Tags,
		StartDate:   startDate,
		DueDate:     dueDate,
		Points:      input.Points,
		ProjectID:   input.ProjectID,
		AuthorID:    userID, // Use authenticated user as author
		AssigneeID:  input.AssigneeID,
	}

	if err := database.DB.Create(&task).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "error creating task", "error": err.Error()})
	}

	return c.Status(201).JSON(task)
}

func UpdateTaskStatus(c *fiber.Ctx) error {

	task_id := c.Params("id")
	id, err := strconv.Atoi(task_id)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "invalid projectidddd"})
	}

	var body struct {
		Status string `json:"status" validate:"required"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "error inavalid reqqq",
			"erorr":   err.Error(),
		})
	}

	validate := validator.New()
	if err := validate.Struct(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "validation failed : /",
			"errors":  err.Error(),
		})
	}

	if err := database.DB.Debug().Model(&models.Task{}).Where("task_id = ?", id).Update("status", body.Status).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"messsage": "error in giving tasks" + err.Error()})
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"messsage": "succ",
		"taskId":   id,
		"status":   body.Status,
	})
}
