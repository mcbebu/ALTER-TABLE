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
		field.String("mobileNumber").NotEmpty().Unique().Immutable(),
		field.JSON("addresses", []Address{}).Default([]Address{}),
		field.Bool("leaveParcel").Default(false),
		field.JSON("instructions", []string{}).Default([]string{}),
		// [2stop, 3stop, 4stop, 5stop] (cannot close notification for 1stop, default is 1stop and 3stop)
		field.JSON("notifications", [4]bool{}).Default([4]bool{false, true, false, false}),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("orders", Order.Type).Unique(),
	}
}
