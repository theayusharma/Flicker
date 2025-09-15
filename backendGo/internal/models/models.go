package models

import (
	"gorm.io/gorm"
	"time"
)

type Team struct {
	ID                   uint `gorm:"column:team_id;primaryKey;autoIncrement"`
	CreatedAt            time.Time
	UpdatedAt            time.Time
	DeletedAt            gorm.DeletedAt `gorm:"index"`
	TeamName             string         `gorm:"not null"`
	ProductOwnerUserID   *uint          `gorm:"index"`
	ProjectManagerUserID *uint          `gorm:"index"` // Non-referentia

	Users        []User        `gorm:"foreignKey:TeamID"`
	ProjectTeams []ProjectTeam `gorm:"foreignKey:TeamID"`
}

func (Team) TableName() string { return "teams" }

type User struct {
	UserID            uint `gorm:"column:user_id;primaryKey;autoIncrement"`
	CreatedAt         time.Time
	UpdatedAt         time.Time
	DeletedAt         gorm.DeletedAt `gorm:"index"`
	Provider          string         `gorm:"not null;default:'github';index"`
	ProviderID        string         `gorm:"unique;not null;index"`
	Email             *string        `gorm:"unique;index"`
	Username          string         `gorm:"unique;not null"`
	GithubUsername    string         `gorm:"unique`
	ProfilePictureURL *string        `gorm:"type:text"`
	TeamID            *uint          `gorm:"index"`

	Team            *Team            `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;foreignKey:TeamID"`
	AuthoredTasks   []Task           `gorm:"foreignKey:AuthorID;references:UserID"`
	AssignedTasks   []Task           `gorm:"foreignKey:AssigneeID;references:UserID"`
	TaskAssignments []TaskAssignment `gorm:"foreignKey:UserID"`
	Attachments     []Attachment     `gorm:"foreignKey:UploadedByID"`
}

func (User) TableName() string { return "users" }

type Project struct {
	ID          uint `gorm:"column:project_id;primaryKey;autoIncrement"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `gorm:"index"`
	Name        string         `gorm:"not null"`
	Description *string        `gorm:"type:text"`
	StartDate   *time.Time
	EndDate     *time.Time

	Tasks        []Task        `gorm:"foreignKey:ProjectID"`
	ProjectTeams []ProjectTeam `gorm:"foreignKey:ProjectID"`
}

func (Project) TableName() string { return "projects" }

type ProjectTeam struct {
	ID        uint `gorm:"column:project_team_id;primaryKey;autoIncrement"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	TeamID    uint           `gorm:"not null;index"`
	ProjectID uint           `gorm:"not null;index"`

	Team    Team    `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;foreignKey:TeamID"`
	Project Project `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;foreignKey:ProjectID"`
}

func (ProjectTeam) TableName() string { return "project_teams" }

type Task struct {
	ID          uint `gorm:"column:task_id;primaryKey;autoIncrement"json:"id"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
	DeletedAt   gorm.DeletedAt `gorm:"index"`
	Title       string         `gorm:"not null"`
	Description *string        `gorm:"type:text"`
	// Status      *string        `gorm:"type:varchar(50)"`
	Status     *string `gorm:"type:varchar(50);check:status IN ('todo','in_progress','review','done')" json:"status"`
	Priority   *string `gorm:"type:varchar(50)"`
	Tags       *string `gorm:"type:text"`
	StartDate  *time.Time
	DueDate    *time.Time
	Points     *uint
	ProjectID  uint  `gorm:"not null;index"json:"project_id"`
	AuthorID   uint  `gorm:"not null;index"`
	AssigneeID *uint `gorm:"index"`

	Project         Project          `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;foreignKey:ProjectID"`
	Author          User             `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;foreignKey:AuthorID;references:UserID"`
	Assignee        *User            `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;foreignKey:AssigneeID;references:UserID"`
	TaskAssignments []TaskAssignment `gorm:"foreignKey:TaskID"`
	Attachments     []Attachment     `json:"attachments" gorm:"foreignKey:TaskID"`
}

func (Task) TableName() string { return "tasks" }

type TaskAssignment struct {
	ID        uint `gorm:"column:task_assi_id;primaryKey;autoIncrement"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`
	UserID    uint           `gorm:"not null;index"`
	TaskID    uint           `gorm:"not null;index"`

	User User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;foreignKey:UserID"`
	Task Task `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;foreignKey:TaskID"`
}

func (TaskAssignment) TableName() string { return "task_assignments" }

type Attachment struct {
	ID           uint `gorm:"column:attachment_id;primaryKey;autoIncrement"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	DeletedAt    gorm.DeletedAt `gorm:"index"`
	FileURL      string         `gorm:"not null;type:text"`
	FileName     *string        `gorm:"type:text"`
	TaskID       uint           `gorm:"not null;index"`
	UploadedByID uint           `gorm:"not null;index"`

	Task       Task `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;foreignKey:TaskID"`
	UploadedBy User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL;foreignKey:UploadedByID"`
}

func (Attachment) TableName() string { return "attachments" }

type Comment struct {
	ID     uint   `gorm:"column:id;primaryKey;autoIncrement"`
	Text   string `gorm:"type:text;not null"`
	TaskID uint   `gorm:"not null;index"`
	UserID uint   `gorm:"not null;index"`

	Task Task `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;foreignKey:TaskID;references:ID"`
	User User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE;foreignKey:UserID;references:UserID"`
}

func (Comment) TableName() string { return "comment" }
