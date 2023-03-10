// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"

	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/mcbebu/ALTER-TABLE/ent/order"
	"github.com/mcbebu/ALTER-TABLE/ent/shipper"
)

// ShipperCreate is the builder for creating a Shipper entity.
type ShipperCreate struct {
	config
	mutation *ShipperMutation
	hooks    []Hook
}

// SetName sets the "name" field.
func (sc *ShipperCreate) SetName(s string) *ShipperCreate {
	sc.mutation.SetName(s)
	return sc
}

// AddOrderIDs adds the "orders" edge to the Order entity by IDs.
func (sc *ShipperCreate) AddOrderIDs(ids ...int) *ShipperCreate {
	sc.mutation.AddOrderIDs(ids...)
	return sc
}

// AddOrders adds the "orders" edges to the Order entity.
func (sc *ShipperCreate) AddOrders(o ...*Order) *ShipperCreate {
	ids := make([]int, len(o))
	for i := range o {
		ids[i] = o[i].ID
	}
	return sc.AddOrderIDs(ids...)
}

// Mutation returns the ShipperMutation object of the builder.
func (sc *ShipperCreate) Mutation() *ShipperMutation {
	return sc.mutation
}

// Save creates the Shipper in the database.
func (sc *ShipperCreate) Save(ctx context.Context) (*Shipper, error) {
	return withHooks[*Shipper, ShipperMutation](ctx, sc.sqlSave, sc.mutation, sc.hooks)
}

// SaveX calls Save and panics if Save returns an error.
func (sc *ShipperCreate) SaveX(ctx context.Context) *Shipper {
	v, err := sc.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (sc *ShipperCreate) Exec(ctx context.Context) error {
	_, err := sc.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (sc *ShipperCreate) ExecX(ctx context.Context) {
	if err := sc.Exec(ctx); err != nil {
		panic(err)
	}
}

// check runs all checks and user-defined validators on the builder.
func (sc *ShipperCreate) check() error {
	if _, ok := sc.mutation.Name(); !ok {
		return &ValidationError{Name: "name", err: errors.New(`ent: missing required field "Shipper.name"`)}
	}
	if v, ok := sc.mutation.Name(); ok {
		if err := shipper.NameValidator(v); err != nil {
			return &ValidationError{Name: "name", err: fmt.Errorf(`ent: validator failed for field "Shipper.name": %w`, err)}
		}
	}
	return nil
}

func (sc *ShipperCreate) sqlSave(ctx context.Context) (*Shipper, error) {
	if err := sc.check(); err != nil {
		return nil, err
	}
	_node, _spec := sc.createSpec()
	if err := sqlgraph.CreateNode(ctx, sc.driver, _spec); err != nil {
		if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	id := _spec.ID.Value.(int64)
	_node.ID = int(id)
	sc.mutation.id = &_node.ID
	sc.mutation.done = true
	return _node, nil
}

func (sc *ShipperCreate) createSpec() (*Shipper, *sqlgraph.CreateSpec) {
	var (
		_node = &Shipper{config: sc.config}
		_spec = sqlgraph.NewCreateSpec(shipper.Table, sqlgraph.NewFieldSpec(shipper.FieldID, field.TypeInt))
	)
	if value, ok := sc.mutation.Name(); ok {
		_spec.SetField(shipper.FieldName, field.TypeString, value)
		_node.Name = value
	}
	if nodes := sc.mutation.OrdersIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.O2M,
			Inverse: false,
			Table:   shipper.OrdersTable,
			Columns: []string{shipper.OrdersColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: &sqlgraph.FieldSpec{
					Type:   field.TypeInt,
					Column: order.FieldID,
				},
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges = append(_spec.Edges, edge)
	}
	return _node, _spec
}

// ShipperCreateBulk is the builder for creating many Shipper entities in bulk.
type ShipperCreateBulk struct {
	config
	builders []*ShipperCreate
}

// Save creates the Shipper entities in the database.
func (scb *ShipperCreateBulk) Save(ctx context.Context) ([]*Shipper, error) {
	specs := make([]*sqlgraph.CreateSpec, len(scb.builders))
	nodes := make([]*Shipper, len(scb.builders))
	mutators := make([]Mutator, len(scb.builders))
	for i := range scb.builders {
		func(i int, root context.Context) {
			builder := scb.builders[i]
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*ShipperMutation)
				if !ok {
					return nil, fmt.Errorf("unexpected mutation type %T", m)
				}
				if err := builder.check(); err != nil {
					return nil, err
				}
				builder.mutation = mutation
				nodes[i], specs[i] = builder.createSpec()
				var err error
				if i < len(mutators)-1 {
					_, err = mutators[i+1].Mutate(root, scb.builders[i+1].mutation)
				} else {
					spec := &sqlgraph.BatchCreateSpec{Nodes: specs}
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, scb.driver, spec); err != nil {
						if sqlgraph.IsConstraintError(err) {
							err = &ConstraintError{msg: err.Error(), wrap: err}
						}
					}
				}
				if err != nil {
					return nil, err
				}
				mutation.id = &nodes[i].ID
				if specs[i].ID.Value != nil {
					id := specs[i].ID.Value.(int64)
					nodes[i].ID = int(id)
				}
				mutation.done = true
				return nodes[i], nil
			})
			for i := len(builder.hooks) - 1; i >= 0; i-- {
				mut = builder.hooks[i](mut)
			}
			mutators[i] = mut
		}(i, ctx)
	}
	if len(mutators) > 0 {
		if _, err := mutators[0].Mutate(ctx, scb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX is like Save, but panics if an error occurs.
func (scb *ShipperCreateBulk) SaveX(ctx context.Context) []*Shipper {
	v, err := scb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (scb *ShipperCreateBulk) Exec(ctx context.Context) error {
	_, err := scb.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (scb *ShipperCreateBulk) ExecX(ctx context.Context) {
	if err := scb.Exec(ctx); err != nil {
		panic(err)
	}
}
