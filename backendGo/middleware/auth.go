package middleware

import (
	"os"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"gorm.io/gorm"

	"backendGo/internal/models"
)

type AuthMiddleware struct {
	DB *gorm.DB
}

func NewAuthMiddleware(db *gorm.DB) *AuthMiddleware {
	return &AuthMiddleware{DB: db}
}

func (m *AuthMiddleware) RequireAuth(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Authorization header required",
		})
	}

	tokenParts := strings.Split(authHeader, " ")
	if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid authorization format. Use: Bearer <token>",
		})
	}

	tokenString := tokenParts[1]
	isDevelopment := os.Getenv("NODE_ENV") != "production" && os.Getenv("ALLOW_DEV_AUTH") == "true"

	var userID uint
	var err error

	if isDevelopment {
		if parsedUserID, parseErr := strconv.ParseUint(tokenString, 10, 32); parseErr == nil {
			userID = uint(parsedUserID)
		} else {

			userID, err = m.parseJWTToken(tokenString)
			if err != nil {
				return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
					"error": "Invalid or expired token",
				})
			}
		}
	} else {

		userID, err = m.parseJWTToken(tokenString)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Invalid or expired token",
			})
		}
	}

	var user models.User
	if err := m.DB.First(&user, userID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "User not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Database error",
		})
	}

	c.Locals("user", user)
	c.Locals("userID", user.UserID)

	return c.Next()
}

func (m *AuthMiddleware) parseJWTToken(tokenString string) (uint, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {

		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.NewError(fiber.StatusUnauthorized, "Invalid signing method")
		}

		jwtSecret := os.Getenv("JWT_SECRET")
		if jwtSecret == "" {
			jwtSecret = "fallback-secret-key"
		}

		return []byte(jwtSecret), nil
	})

	if err != nil || !token.Valid {
		return 0, err
	}

	// Extract user ID from JWT claims
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		if userIDFloat, exists := claims["user_id"]; exists {
			if userIDValue, ok := userIDFloat.(float64); ok {
				return uint(userIDValue), nil
			}
		}
	}

	return 0, fiber.NewError(fiber.StatusUnauthorized, "Invalid token claims")
}
