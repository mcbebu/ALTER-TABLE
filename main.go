package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	_ "github.com/lib/pq"

	"github.com/mcbebu/ALTER-TABLE/ent"
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

	e.Logger.Fatal(e.Start(":8080"))
}
