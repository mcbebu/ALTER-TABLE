package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// Shipper holds the schema definition for the Shipper entity.
type Shipper struct {
	ent.Schema
}

// Fields of the Shipper.
func (Shipper) Fields() []ent.Field {
	return []ent.Field{
		field.String("name").Immutable(),
	}
}

// Edges of the Shipper.
func (Shipper) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("orders", Order.Type).Unique(),
	}
}
