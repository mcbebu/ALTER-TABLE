// Code generated by ent, DO NOT EDIT.

package ent

import (
	"encoding/json"
	"fmt"
	"strings"

	"entgo.io/ent/dialect/sql"
	"github.com/mcbebu/ALTER-TABLE/ent/order"
	"github.com/mcbebu/ALTER-TABLE/ent/schema"
	"github.com/mcbebu/ALTER-TABLE/ent/user"
)

// User is the model entity for the User schema.
type User struct {
	config `json:"-"`
	// ID of the ent.
	ID int `json:"id,omitempty"`
	// MobileNumber holds the value of the "mobileNumber" field.
	MobileNumber string `json:"mobileNumber,omitempty"`
	// Addresses holds the value of the "addresses" field.
	Addresses []schema.Address `json:"addresses,omitempty"`
	// LeaveParcel holds the value of the "leaveParcel" field.
	LeaveParcel bool `json:"leaveParcel,omitempty"`
	// Instructions holds the value of the "instructions" field.
	Instructions []string `json:"instructions,omitempty"`
	// Notifications holds the value of the "notifications" field.
	Notifications [4]bool `json:"notifications,omitempty"`
	// Edges holds the relations/edges for other nodes in the graph.
	// The values are being populated by the UserQuery when eager-loading is set.
	Edges       UserEdges `json:"edges"`
	user_orders *int
}

// UserEdges holds the relations/edges for other nodes in the graph.
type UserEdges struct {
	// Orders holds the value of the orders edge.
	Orders *Order `json:"orders,omitempty"`
	// loadedTypes holds the information for reporting if a
	// type was loaded (or requested) in eager-loading or not.
	loadedTypes [1]bool
}

// OrdersOrErr returns the Orders value or an error if the edge
// was not loaded in eager-loading, or loaded but was not found.
func (e UserEdges) OrdersOrErr() (*Order, error) {
	if e.loadedTypes[0] {
		if e.Orders == nil {
			// Edge was loaded but was not found.
			return nil, &NotFoundError{label: order.Label}
		}
		return e.Orders, nil
	}
	return nil, &NotLoadedError{edge: "orders"}
}

// scanValues returns the types for scanning values from sql.Rows.
func (*User) scanValues(columns []string) ([]any, error) {
	values := make([]any, len(columns))
	for i := range columns {
		switch columns[i] {
		case user.FieldAddresses, user.FieldInstructions, user.FieldNotifications:
			values[i] = new([]byte)
		case user.FieldLeaveParcel:
			values[i] = new(sql.NullBool)
		case user.FieldID:
			values[i] = new(sql.NullInt64)
		case user.FieldMobileNumber:
			values[i] = new(sql.NullString)
		case user.ForeignKeys[0]: // user_orders
			values[i] = new(sql.NullInt64)
		default:
			return nil, fmt.Errorf("unexpected column %q for type User", columns[i])
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the User fields.
func (u *User) assignValues(columns []string, values []any) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case user.FieldID:
			value, ok := values[i].(*sql.NullInt64)
			if !ok {
				return fmt.Errorf("unexpected type %T for field id", value)
			}
			u.ID = int(value.Int64)
		case user.FieldMobileNumber:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field mobileNumber", values[i])
			} else if value.Valid {
				u.MobileNumber = value.String
			}
		case user.FieldAddresses:
			if value, ok := values[i].(*[]byte); !ok {
				return fmt.Errorf("unexpected type %T for field addresses", values[i])
			} else if value != nil && len(*value) > 0 {
				if err := json.Unmarshal(*value, &u.Addresses); err != nil {
					return fmt.Errorf("unmarshal field addresses: %w", err)
				}
			}
		case user.FieldLeaveParcel:
			if value, ok := values[i].(*sql.NullBool); !ok {
				return fmt.Errorf("unexpected type %T for field leaveParcel", values[i])
			} else if value.Valid {
				u.LeaveParcel = value.Bool
			}
		case user.FieldInstructions:
			if value, ok := values[i].(*[]byte); !ok {
				return fmt.Errorf("unexpected type %T for field instructions", values[i])
			} else if value != nil && len(*value) > 0 {
				if err := json.Unmarshal(*value, &u.Instructions); err != nil {
					return fmt.Errorf("unmarshal field instructions: %w", err)
				}
			}
		case user.FieldNotifications:
			if value, ok := values[i].(*[]byte); !ok {
				return fmt.Errorf("unexpected type %T for field notifications", values[i])
			} else if value != nil && len(*value) > 0 {
				if err := json.Unmarshal(*value, &u.Notifications); err != nil {
					return fmt.Errorf("unmarshal field notifications: %w", err)
				}
			}
		case user.ForeignKeys[0]:
			if value, ok := values[i].(*sql.NullInt64); !ok {
				return fmt.Errorf("unexpected type %T for edge-field user_orders", value)
			} else if value.Valid {
				u.user_orders = new(int)
				*u.user_orders = int(value.Int64)
			}
		}
	}
	return nil
}

// QueryOrders queries the "orders" edge of the User entity.
func (u *User) QueryOrders() *OrderQuery {
	return NewUserClient(u.config).QueryOrders(u)
}

// Update returns a builder for updating this User.
// Note that you need to call User.Unwrap() before calling this method if this User
// was returned from a transaction, and the transaction was committed or rolled back.
func (u *User) Update() *UserUpdateOne {
	return NewUserClient(u.config).UpdateOne(u)
}

// Unwrap unwraps the User entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (u *User) Unwrap() *User {
	_tx, ok := u.config.driver.(*txDriver)
	if !ok {
		panic("ent: User is not a transactional entity")
	}
	u.config.driver = _tx.drv
	return u
}

// String implements the fmt.Stringer.
func (u *User) String() string {
	var builder strings.Builder
	builder.WriteString("User(")
	builder.WriteString(fmt.Sprintf("id=%v, ", u.ID))
	builder.WriteString("mobileNumber=")
	builder.WriteString(u.MobileNumber)
	builder.WriteString(", ")
	builder.WriteString("addresses=")
	builder.WriteString(fmt.Sprintf("%v", u.Addresses))
	builder.WriteString(", ")
	builder.WriteString("leaveParcel=")
	builder.WriteString(fmt.Sprintf("%v", u.LeaveParcel))
	builder.WriteString(", ")
	builder.WriteString("instructions=")
	builder.WriteString(fmt.Sprintf("%v", u.Instructions))
	builder.WriteString(", ")
	builder.WriteString("notifications=")
	builder.WriteString(fmt.Sprintf("%v", u.Notifications))
	builder.WriteByte(')')
	return builder.String()
}

// Users is a parsable slice of User.
type Users []*User
