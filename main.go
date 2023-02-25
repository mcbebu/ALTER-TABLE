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
	"github.com/mcbebu/ALTER-TABLE/ent/order"
	"github.com/mcbebu/ALTER-TABLE/ent/shipper"
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

	// hello endpoint (for test)
	e.GET("/hello", func(c echo.Context) error {
		return c.String(http.StatusOK, "Hello Ninja!")
	})

	// read current user
	e.GET("/user", func(c echo.Context) error {
		token, ok := c.Get("token").(*auth.Token)
		if !ok {
			return echo.NewHTTPError(http.StatusInternalServerError)
		}

		u, err := client.User.
			Query().
			Where(
				user.ID(token.UID),
			).
			Only(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		return c.JSON(http.StatusOK, u)
	})

	// create new user
	e.POST("/user", func(c echo.Context) error {
		input := new(ent.User)
		c.Bind(input)

		token, ok := c.Get("token").(*auth.Token)
		if !ok {
			return echo.NewHTTPError(http.StatusInternalServerError)
		}

		u, err := client.User.
			Create().
			SetID(token.UID).
			SetMobileNumber(token.Claims["phone_number"].(string)).
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

	// update current user
	e.PUT("/user", func(c echo.Context) error {
		token, ok := c.Get("token").(*auth.Token)
		if !ok {
			return echo.NewHTTPError(http.StatusInternalServerError)
		}

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		input := new(ent.User)
		c.Bind(input)

		u, err := client.User.
			UpdateOneID(token.UID).
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

	// get orders of current user
	e.GET("/orders", func(c echo.Context) error {
		token, ok := c.Get("token").(*auth.Token)
		if !ok {
			return echo.NewHTTPError(http.StatusInternalServerError)
		}

		o, err := client.Order.Query().
			Where(
				order.MobileNumber(token.Claims["phone_number"].(string)),
			).
			All(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		return c.JSON(http.StatusOK, o)
	})

	// read order
	e.GET("/order/:id", func(c echo.Context) error {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		token, ok := c.Get("token").(*auth.Token)
		if !ok {
			return echo.NewHTTPError(http.StatusInternalServerError)
		}

		o, err := client.Order.
			Query().
			Where(
				order.ID(id),
				order.MobileNumber(token.Claims["phone_number"].(string)),
			).
			Only(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		return c.JSON(http.StatusOK, o)
	})

	// update order
	e.PUT("/order/:id", func(c echo.Context) error {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		token, ok := c.Get("token").(*auth.Token)
		if !ok {
			return echo.NewHTTPError(http.StatusInternalServerError)
		}

		o, err := client.Order.
			Query().
			Where(
				order.ID(id),
				order.MobileNumber(token.Claims["phone_number"].(string)),
			).
			Only(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		input := new(ent.Order)
		c.Bind(input)

		if o.Status == "On the way" || o.Status == "Delivered" {
			// prevent updating alt mobile number and address
			o, err = o.Update().
				SetLeaveParcel(input.LeaveParcel).
				SetInstructions(input.Instructions).
				Save(context.Background())

			if err != nil {
				return echo.NewHTTPError(http.StatusBadRequest, err.Error())
			}

			return c.JSON(http.StatusOK, o)
		}

		o, err = o.Update().
			SetAltMobileNumber(input.AltMobileNumber).
			SetAddress(input.Address).
			SetLeaveParcel(input.LeaveParcel).
			SetInstructions(input.Instructions).
			Save(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		return c.JSON(http.StatusOK, o)
	})

	// shipper - get orders
	e.GET("/shipper/orders", func(c echo.Context) error {
		//TODO: add shipper auth
		shipperId := 1

		o, err := client.Order.Query().
			Where(
				order.HasShippersWith(
					shipper.ID(shipperId),
				),
			).
			All(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		return c.JSON(http.StatusOK, o)
	})

	// shipper - create new order
	e.POST("/shipper/order", func(c echo.Context) error {
		//TODO: add shipper auth
		shipperId := 1

		input := new(ent.Order)
		c.Bind(input)

		u, _ := client.User.
			Query().
			Where(
				user.MobileNumber(input.MobileNumber),
			).Only(context.Background())

		if u != nil {
			input.LeaveParcel = u.LeaveParcel
			input.Instructions = u.Instructions
		} else {
			input.LeaveParcel = false
			input.Instructions = []string{}
		}

		o, err := client.Order.
			Create().
			SetName(input.Name).
			SetTitle(input.Title).
			SetDescription(input.Description).
			SetMobileNumber(input.MobileNumber).
			SetAltMobileNumber(input.AltMobileNumber).
			SetAddress(input.Address).
			SetLeaveParcel(input.LeaveParcel).
			SetInstructions(input.Instructions).
			SetShippersID(shipperId).
			Save(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		return c.JSON(http.StatusOK, o)
	})

	// shipper - update order
	e.PUT("/shipper/order/:id", func(c echo.Context) error {
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		//TODO: add shipper auth
		shipperId := 1

		o, err := client.Order.
			Query().
			Where(
				order.ID(id),
				order.HasShippersWith(
					shipper.ID(shipperId),
				),
			).
			Only(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		input := new(ent.Order)
		c.Bind(input)

		o, err = o.Update().
			SetAltMobileNumber(input.AltMobileNumber).
			SetAddress(input.Address).
			SetLeaveParcel(input.LeaveParcel).
			SetInstructions(input.Instructions).
			SetStatus(input.Status).
			SetStopsUntilDelivery(input.StopsUntilDelivery).
			SetEstimatedArrivalTime(input.EstimatedArrivalTime).
			Save(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		return c.JSON(http.StatusOK, o)
	})

	// shipper - delete order
	e.DELETE("/shipper/order/:id", func(c echo.Context) error {
		//TODO: add shipper auth
		shipperId := 1

		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		err = client.Order.DeleteOneID(id).
			Where(
				order.HasShippersWith(
					shipper.ID(shipperId),
				),
			).
			Exec(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		message := map[string]string{"message": "delete success"}

		return c.JSON(http.StatusOK, message)
	})

	e.GET("/shipper", func(c echo.Context) error {
		//TODO: add shipper auth
		shipperId := 1

		s, err := client.Shipper.
			Query().
			Where(
				shipper.ID(shipperId),
			).
			Only(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest)
		}

		return c.JSON(http.StatusOK, s)
	})

	// create new shipper
	e.POST("/shipper", func(c echo.Context) error {
		//TODO: add shipper auth
		input := new(ent.Shipper)
		c.Bind(input)

		s, err := client.Shipper.
			Create().
			SetName(input.Name).
			Save(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest)
		}

		return c.JSON(http.StatusOK, s)
	})

	// update shipper
	e.PUT("/shipper/:id", func(c echo.Context) error {
		//TODO: add shipper auth
		input := new(ent.Shipper)
		c.Bind(input)

		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		s, err := client.Shipper.
			UpdateOneID(id).
			SetName(input.Name).
			Save(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest)
		}

		return c.JSON(http.StatusOK, s)
	})

	// update shipper
	e.DELETE("/shipper/:id", func(c echo.Context) error {
		//TODO: add shipper auth
		id, err := strconv.Atoi(c.Param("id"))
		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest, err.Error())
		}

		err = client.Shipper.DeleteOneID(id).Exec(context.Background())

		if err != nil {
			return echo.NewHTTPError(http.StatusBadRequest)
		}

		message := map[string]string{"message": "delete success"}

		return c.JSON(http.StatusOK, message)
	})

	e.Logger.Fatal(e.Start(":8080"))
}
