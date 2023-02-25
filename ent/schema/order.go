package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

// Order holds the schema definition for the Order entity.
type Order struct {
	ent.Schema
}

// Fields of the Order.
func (Order) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").NotEmpty(),
		field.String("title").NotEmpty(),
		field.String("description").Optional(),
		field.String("altMobileNumber").Optional(),
		field.JSON("address", Address{}).Default(Address{}),
		field.Bool("leaveParcel").Default(false),
		field.JSON("instructions", []string{}).Default([]string{}),
		field.Enum("status").Values("Order created", "Picked up", "On the way", "Delivered").Default("Order created"),
		field.Int("stopsUntilDelivery").NonNegative().Optional(),
		field.Int("estimatedArrivalTime").NonNegative().Optional(),
		field.Time("createdAt").Default(time.Now).Immutable(),
	}
}

// Edges of the Order.
func (Order) Edges() []ent.Edge {
	return nil
}
