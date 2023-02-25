// Code generated by ent, DO NOT EDIT.

package order

import (
	"fmt"
	"time"

	"github.com/mcbebu/ALTER-TABLE/ent/schema"
)

const (
	// Label holds the string label denoting the order type in the database.
	Label = "order"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldName holds the string denoting the name field in the database.
	FieldName = "name"
	// FieldTitle holds the string denoting the title field in the database.
	FieldTitle = "title"
	// FieldDescription holds the string denoting the description field in the database.
	FieldDescription = "description"
	// FieldAltMobileNumber holds the string denoting the altmobilenumber field in the database.
	FieldAltMobileNumber = "alt_mobile_number"
	// FieldAddress holds the string denoting the address field in the database.
	FieldAddress = "address"
	// FieldLeaveParcel holds the string denoting the leaveparcel field in the database.
	FieldLeaveParcel = "leave_parcel"
	// FieldInstructions holds the string denoting the instructions field in the database.
	FieldInstructions = "instructions"
	// FieldStatus holds the string denoting the status field in the database.
	FieldStatus = "status"
	// FieldStopsUntilDelivery holds the string denoting the stopsuntildelivery field in the database.
	FieldStopsUntilDelivery = "stops_until_delivery"
	// FieldEstimatedArrivalTime holds the string denoting the estimatedarrivaltime field in the database.
	FieldEstimatedArrivalTime = "estimated_arrival_time"
	// FieldCreatedAt holds the string denoting the createdat field in the database.
	FieldCreatedAt = "created_at"
	// Table holds the table name of the order in the database.
	Table = "orders"
)

// Columns holds all SQL columns for order fields.
var Columns = []string{
	FieldID,
	FieldName,
	FieldTitle,
	FieldDescription,
	FieldAltMobileNumber,
	FieldAddress,
	FieldLeaveParcel,
	FieldInstructions,
	FieldStatus,
	FieldStopsUntilDelivery,
	FieldEstimatedArrivalTime,
	FieldCreatedAt,
}

// ValidColumn reports if the column name is valid (part of the table columns).
func ValidColumn(column string) bool {
	for i := range Columns {
		if column == Columns[i] {
			return true
		}
	}
	return false
}

var (
	// NameValidator is a validator for the "name" field. It is called by the builders before save.
	NameValidator func(string) error
	// TitleValidator is a validator for the "title" field. It is called by the builders before save.
	TitleValidator func(string) error
	// DefaultAddress holds the default value on creation for the "address" field.
	DefaultAddress schema.Address
	// DefaultLeaveParcel holds the default value on creation for the "leaveParcel" field.
	DefaultLeaveParcel bool
	// DefaultInstructions holds the default value on creation for the "instructions" field.
	DefaultInstructions []string
	// StopsUntilDeliveryValidator is a validator for the "stopsUntilDelivery" field. It is called by the builders before save.
	StopsUntilDeliveryValidator func(int) error
	// EstimatedArrivalTimeValidator is a validator for the "estimatedArrivalTime" field. It is called by the builders before save.
	EstimatedArrivalTimeValidator func(int) error
	// DefaultCreatedAt holds the default value on creation for the "createdAt" field.
	DefaultCreatedAt func() time.Time
)

// Status defines the type for the "status" enum field.
type Status string

// StatusOrderCreated is the default value of the Status enum.
const DefaultStatus = StatusOrderCreated

// Status values.
const (
	StatusOrderCreated Status = "Order created"
	StatusPickedUp     Status = "Picked up"
	StatusOnTheWay     Status = "On the way"
	StatusDelivered    Status = "Delivered"
)

func (s Status) String() string {
	return string(s)
}

// StatusValidator is a validator for the "status" field enum values. It is called by the builders before save.
func StatusValidator(s Status) error {
	switch s {
	case StatusOrderCreated, StatusPickedUp, StatusOnTheWay, StatusDelivered:
		return nil
	default:
		return fmt.Errorf("order: invalid enum value for status field: %q", s)
	}
}