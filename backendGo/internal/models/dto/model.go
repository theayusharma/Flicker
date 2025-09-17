package dto

type Task struct {
	ID          uint    `json:"id"`
	Title       string  `json:"title" validate:"required"`
	Description *string `json:"description"`
	Status      *string `json:"status"`
	Priority    *string `json:"priority"`
	Tags        *string `json:"tags"`
	StartDate   *string `json:"startdate"`
	DueDate     *string `json:"duedate"`
	Points      *uint   `json:"points"`
	ProjectID   uint    `json:"projectid" validate:"required"`
	AuthorID    uint    `json:"authorid"`
	AssigneeID  *uint   `json:"assigneeid"`
}
