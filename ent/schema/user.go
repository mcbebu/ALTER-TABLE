package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("id").Unique().Immutable(),
		field.String("mobileNumber").NotEmpty().Unique().Immutable(),
		field.JSON("addresses", []Address{}).Default([]Address{}),
		field.Bool("leaveParcel").Default(false),
		field.JSON("instructions", []string{}).Default([]string{}),
		field.JSON("notifications", [4]bool{}).Default([4]bool{true, false, false, false}),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("orders", Order.Type),
	}
}
