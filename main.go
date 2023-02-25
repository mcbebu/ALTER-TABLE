package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"firebase.google.com/go/auth"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	_ "github.com/lib/pq"

	"github.com/mcbebu/ALTER-TABLE/ent"
	"github.com/mcbebu/ALTER-TABLE/ent/user"
	authMiddleware "github.com/mcbebu/ALTER-TABLE/middleware"
)

func main() {
	godotenv.Load()

	connectionString := fmt.Sprint(
		"host=", os.Getenv("PG_HOST"), " ",
		"port=", 5432, " ",
		"user=", os.Getenv("PG_USER"), " ",
		"dbname=", os.Getenv("PG_DATABASE"), " ",
		"password=", os.Getenv("PG_PASSWORD"),
	)

	client, err := ent.Open("postgres", connectionString)
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	defer client.Close()
	// Run the auto migration tool.
	if err := client.Schema.Create(context.Background()); err != nil {
		log.Fatalf("Failed creating schema resources: %v", err)
	}

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept, echo.HeaderXRequestedWith, echo.HeaderAuthorization},
	}))
	e.Use(authMiddleware.Auth())

	e.GET("/hello", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello Ninja!")
	})

	e.GET("/user/:id", func(c echo.Context) error {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		token, ok := c.Get("token").(*auth.Token)
		if !ok {
			return echo.NewHTTPError(http.StatusInternalServerError)
		}

		phoneNumber := token.Claims["phone_number"].(string)

		u, err := client.User.
			Query().
			Where(
				user.ID(id),
			).
			Only(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		if u.MobileNumber != phoneNumber {
			return echo.NewHTTPError(http.StatusUnauthorized)
		}

		return c.JSON(http.StatusOK, u)
	})

	// create new user
	e.POST("/user", func(c echo.Context) error {
		input := new(ent.User)
		c.Bind(input)

		u, err := client.User.
			Create().
			SetMobileNumber(input.MobileNumber).
			SetAddresses(input.Addresses).
			SetLeaveParcel(input.LeaveParcel).
			SetInstructions(input.Instructions).
			SetNotifications(input.Notifications).
			Save(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		return c.JSON(http.StatusOK, u)
	})

	// update user
	e.PUT("/user/:id", func(c echo.Context) error {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		token, ok := c.Get("token").(*auth.Token)
		if !ok {
			return echo.NewHTTPError(http.StatusInternalServerError)
		}

		phoneNumber := token.Claims["phone_number"].(string)

		u, err := client.User.
			Query().
			Where(
				user.ID(id),
			).
			Only(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		if u.MobileNumber != phoneNumber {
			return echo.NewHTTPError(http.StatusUnauthorized)
		}

		input := new(ent.User)
		c.Bind(input)

		u, err = client.User.
			UpdateOneID(id).
			SetAddresses(input.Addresses).
			SetLeaveParcel(input.LeaveParcel).
			SetInstructions(input.Instructions).
			SetNotifications(input.Notifications).
			Save(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		return c.JSON(http.StatusOK, u)
	})

	// update user
	e.DELETE("/user/:id", func(c echo.Context) error {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		token, ok := c.Get("token").(*auth.Token)
		if !ok {
			return echo.NewHTTPError(http.StatusInternalServerError)
		}

		phoneNumber := token.Claims["phone_number"].(string)

		u, err := client.User.
			Query().
			Where(
				user.ID(id),
			).
			Only(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		if u.MobileNumber != phoneNumber {
			return echo.NewHTTPError(http.StatusUnauthorized)
		}

		input := new(ent.User)
		c.Bind(input)

		err = client.User.
			DeleteOneID(id).
			Exec(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		return c.JSON(http.StatusOK, u)
	})

	e.Logger.Fatal(e.Start(":8080"))
}
