// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"
	"time"

	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/mcbebu/ALTER-TABLE/ent/order"
	"github.com/mcbebu/ALTER-TABLE/ent/schema"
)

// OrderCreate is the builder for creating a Order entity.
type OrderCreate struct {
	config
	mutation *OrderMutation
	hooks    []Hook
}

// SetName sets the "name" field.
func (oc *OrderCreate) SetName(s string) *OrderCreate {
	oc.mutation.SetName(s)
	return oc
}

// SetTitle sets the "title" field.
func (oc *OrderCreate) SetTitle(s string) *OrderCreate {
	oc.mutation.SetTitle(s)
	return oc
}

// SetDescription sets the "description" field.
func (oc *OrderCreate) SetDescription(s string) *OrderCreate {
	oc.mutation.SetDescription(s)
	return oc
}

// SetNillableDescription sets the "description" field if the given value is not nil.
func (oc *OrderCreate) SetNillableDescription(s *string) *OrderCreate {
	if s != nil {
		oc.SetDescription(*s)
	}
	return oc
}

// SetAltMobileNumber sets the "altMobileNumber" field.
func (oc *OrderCreate) SetAltMobileNumber(s string) *OrderCreate {
	oc.mutation.SetAltMobileNumber(s)
	return oc
}

// SetNillableAltMobileNumber sets the "altMobileNumber" field if the given value is not nil.
func (oc *OrderCreate) SetNillableAltMobileNumber(s *string) *OrderCreate {
	if s != nil {
		oc.SetAltMobileNumber(*s)
	}
	return oc
}

// SetAddress sets the "address" field.
func (oc *OrderCreate) SetAddress(s schema.Address) *OrderCreate {
	oc.mutation.SetAddress(s)
	return oc
}

// SetNillableAddress sets the "address" field if the given value is not nil.
func (oc *OrderCreate) SetNillableAddress(s *schema.Address) *OrderCreate {
	if s != nil {
		oc.SetAddress(*s)
	}
	return oc
}

// SetLeaveParcel sets the "leaveParcel" field.
func (oc *OrderCreate) SetLeaveParcel(b bool) *OrderCreate {
	oc.mutation.SetLeaveParcel(b)
	return oc
}

// SetNillableLeaveParcel sets the "leaveParcel" field if the given value is not nil.
func (oc *OrderCreate) SetNillableLeaveParcel(b *bool) *OrderCreate {
	if b != nil {
		oc.SetLeaveParcel(*b)
	}
	return oc
}

// SetInstructions sets the "instructions" field.
func (oc *OrderCreate) SetInstructions(s []string) *OrderCreate {
	oc.mutation.SetInstructions(s)
	return oc
}

// SetStatus sets the "status" field.
func (oc *OrderCreate) SetStatus(o order.Status) *OrderCreate {
	oc.mutation.SetStatus(o)
	return oc
}

// SetNillableStatus sets the "status" field if the given value is not nil.
func (oc *OrderCreate) SetNillableStatus(o *order.Status) *OrderCreate {
	if o != nil {
		oc.SetStatus(*o)
	}
	return oc
}

// SetStopsUntilDelivery sets the "stopsUntilDelivery" field.
func (oc *OrderCreate) SetStopsUntilDelivery(i int) *OrderCreate {
	oc.mutation.SetStopsUntilDelivery(i)
	return oc
}

// SetNillableStopsUntilDelivery sets the "stopsUntilDelivery" field if the given value is not nil.
func (oc *OrderCreate) SetNillableStopsUntilDelivery(i *int) *OrderCreate {
	if i != nil {
		oc.SetStopsUntilDelivery(*i)
	}
	return oc
}

// SetEstimatedArrivalTime sets the "estimatedArrivalTime" field.
func (oc *OrderCreate) SetEstimatedArrivalTime(i int) *OrderCreate {
	oc.mutation.SetEstimatedArrivalTime(i)
	return oc
}

// SetNillableEstimatedArrivalTime sets the "estimatedArrivalTime" field if the given value is not nil.
func (oc *OrderCreate) SetNillableEstimatedArrivalTime(i *int) *OrderCreate {
	if i != nil {
		oc.SetEstimatedArrivalTime(*i)
	}
	return oc
}

// SetCreatedAt sets the "createdAt" field.
func (oc *OrderCreate) SetCreatedAt(t time.Time) *OrderCreate {
	oc.mutation.SetCreatedAt(t)
	return oc
}

// SetNillableCreatedAt sets the "createdAt" field if the given value is not nil.
func (oc *OrderCreate) SetNillableCreatedAt(t *time.Time) *OrderCreate {
	if t != nil {
		oc.SetCreatedAt(*t)
	}
	return oc
}

// Mutation returns the OrderMutation object of the builder.
func (oc *OrderCreate) Mutation() *OrderMutation {
	return oc.mutation
}

// Save creates the Order in the database.
func (oc *OrderCreate) Save(ctx context.Context) (*Order, error) {
	oc.defaults()
	return withHooks[*Order, OrderMutation](ctx, oc.sqlSave, oc.mutation, oc.hooks)
}

// SaveX calls Save and panics if Save returns an error.
func (oc *OrderCreate) SaveX(ctx context.Context) *Order {
	v, err := oc.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (oc *OrderCreate) Exec(ctx context.Context) error {
	_, err := oc.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (oc *OrderCreate) ExecX(ctx context.Context) {
	if err := oc.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (oc *OrderCreate) defaults() {
	if _, ok := oc.mutation.Address(); !ok {
		v := order.DefaultAddress
		oc.mutation.SetAddress(v)
	}
	if _, ok := oc.mutation.LeaveParcel(); !ok {
		v := order.DefaultLeaveParcel
		oc.mutation.SetLeaveParcel(v)
	}
	if _, ok := oc.mutation.Instructions(); !ok {
		v := order.DefaultInstructions
		oc.mutation.SetInstructions(v)
	}
	if _, ok := oc.mutation.Status(); !ok {
		v := order.DefaultStatus
		oc.mutation.SetStatus(v)
	}
	if _, ok := oc.mutation.CreatedAt(); !ok {
		v := order.DefaultCreatedAt()
		oc.mutation.SetCreatedAt(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (oc *OrderCreate) check() error {
	if _, ok := oc.mutation.Name(); !ok {
		return &ValidationError{Name: "name", err: errors.New(`ent: missing required field "Order.name"`)}
	}
	if v, ok := oc.mutation.Name(); ok {
		if err := order.NameValidator(v); err != nil {
			return &ValidationError{Name: "name", err: fmt.Errorf(`ent: validator failed for field "Order.name": %w`, err)}
		}
	}
	if _, ok := oc.mutation.Title(); !ok {
		return &ValidationError{Name: "title", err: errors.New(`ent: missing required field "Order.title"`)}
	}
	if v, ok := oc.mutation.Title(); ok {
		if err := order.TitleValidator(v); err != nil {
			return &ValidationError{Name: "title", err: fmt.Errorf(`ent: validator failed for field "Order.title": %w`, err)}
		}
	}
	if _, ok := oc.mutation.Address(); !ok {
		return &ValidationError{Name: "address", err: errors.New(`ent: missing required field "Order.address"`)}
	}
	if _, ok := oc.mutation.LeaveParcel(); !ok {
		return &ValidationError{Name: "leaveParcel", err: errors.New(`ent: missing required field "Order.leaveParcel"`)}
	}
	if _, ok := oc.mutation.Instructions(); !ok {
		return &ValidationError{Name: "instructions", err: errors.New(`ent: missing required field "Order.instructions"`)}
	}
	if _, ok := oc.mutation.Status(); !ok {
		return &ValidationError{Name: "status", err: errors.New(`ent: missing required field "Order.status"`)}
	}
	if v, ok := oc.mutation.Status(); ok {
		if err := order.StatusValidator(v); err != nil {
			return &ValidationError{Name: "status", err: fmt.Errorf(`ent: validator failed for field "Order.status": %w`, err)}
		}
	}
	if v, ok := oc.mutation.StopsUntilDelivery(); ok {
		if err := order.StopsUntilDeliveryValidator(v); err != nil {
			return &ValidationError{Name: "stopsUntilDelivery", err: fmt.Errorf(`ent: validator failed for field "Order.stopsUntilDelivery": %w`, err)}
		}
	}
	if v, ok := oc.mutation.EstimatedArrivalTime(); ok {
		if err := order.EstimatedArrivalTimeValidator(v); err != nil {
			return &ValidationError{Name: "estimatedArrivalTime", err: fmt.Errorf(`ent: validator failed for field "Order.estimatedArrivalTime": %w`, err)}
		}
	}
	if _, ok := oc.mutation.CreatedAt(); !ok {
		return &ValidationError{Name: "createdAt", err: errors.New(`ent: missing required field "Order.createdAt"`)}
	}
	return nil
}

func (oc *OrderCreate) sqlSave(ctx context.Context) (*Order, error) {
	if err := oc.check(); err != nil {
		return nil, err
	}
	_node, _spec := oc.createSpec()
	if err := sqlgraph.CreateNode(ctx, oc.driver, _spec); err != nil {
		if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	id := _spec.ID.Value.(int64)
	_node.ID = int(id)
	oc.mutation.id = &_node.ID
	oc.mutation.done = true
	return _node, nil
}

func (oc *OrderCreate) createSpec() (*Order, *sqlgraph.CreateSpec) {
	var (
		_node = &Order{config: oc.config}
		_spec = sqlgraph.NewCreateSpec(order.Table, sqlgraph.NewFieldSpec(order.FieldID, field.TypeInt))
	)
	if value, ok := oc.mutation.Name(); ok {
		_spec.SetField(order.FieldName, field.TypeString, value)
		_node.Name = value
	}
	if value, ok := oc.mutation.Title(); ok {
		_spec.SetField(order.FieldTitle, field.TypeString, value)
		_node.Title = value
	}
	if value, ok := oc.mutation.Description(); ok {
		_spec.SetField(order.FieldDescription, field.TypeString, value)
		_node.Description = value
	}
	if value, ok := oc.mutation.AltMobileNumber(); ok {
		_spec.SetField(order.FieldAltMobileNumber, field.TypeString, value)
		_node.AltMobileNumber = value
	}
	if value, ok := oc.mutation.Address(); ok {
		_spec.SetField(order.FieldAddress, field.TypeJSON, value)
		_node.Address = value
	}
	if value, ok := oc.mutation.LeaveParcel(); ok {
		_spec.SetField(order.FieldLeaveParcel, field.TypeBool, value)
		_node.LeaveParcel = value
	}
	if value, ok := oc.mutation.Instructions(); ok {
		_spec.SetField(order.FieldInstructions, field.TypeJSON, value)
		_node.Instructions = value
	}
	if value, ok := oc.mutation.Status(); ok {
		_spec.SetField(order.FieldStatus, field.TypeEnum, value)
		_node.Status = value
	}
	if value, ok := oc.mutation.StopsUntilDelivery(); ok {
		_spec.SetField(order.FieldStopsUntilDelivery, field.TypeInt, value)
		_node.StopsUntilDelivery = value
	}
	if value, ok := oc.mutation.EstimatedArrivalTime(); ok {
		_spec.SetField(order.FieldEstimatedArrivalTime, field.TypeInt, value)
		_node.EstimatedArrivalTime = value
	}
	if value, ok := oc.mutation.CreatedAt(); ok {
		_spec.SetField(order.FieldCreatedAt, field.TypeTime, value)
		_node.CreatedAt = value
	}
	return _node, _spec
}

// OrderCreateBulk is the builder for creating many Order entities in bulk.
type OrderCreateBulk struct {
	config
	builders []*OrderCreate
}

// Save creates the Order entities in the database.
func (ocb *OrderCreateBulk) Save(ctx context.Context) ([]*Order, error) {
	specs := make([]*sqlgraph.CreateSpec, len(ocb.builders))
	nodes := make([]*Order, len(ocb.builders))
	mutators := make([]Mutator, len(ocb.builders))
	for i := range ocb.builders {
		func(i int, root context.Context) {
			builder := ocb.builders[i]
			builder.defaults()
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*OrderMutation)
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
					_, err = mutators[i+1].Mutate(root, ocb.builders[i+1].mutation)
				} else {
					spec := &sqlgraph.BatchCreateSpec{Nodes: specs}
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, ocb.driver, spec); err != nil {
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
		if _, err := mutators[0].Mutate(ctx, ocb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX is like Save, but panics if an error occurs.
func (ocb *OrderCreateBulk) SaveX(ctx context.Context) []*Order {
	v, err := ocb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (ocb *OrderCreateBulk) Exec(ctx context.Context) error {
	_, err := ocb.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (ocb *OrderCreateBulk) ExecX(ctx context.Context) {
	if err := ocb.Exec(ctx); err != nil {
		panic(err)
	}
}