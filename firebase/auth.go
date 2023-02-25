package firebase

import (
	"context"
	"log"

	"firebase.google.com/go/auth"
)

func VerifyIDToken(ctx context.Context, idToken string) (*auth.Token, error) {
	client, err := NewApp().Auth(ctx)
	if err != nil {
		log.Fatalf("error getting Auth client: %v\n", err)
	}
	token, err := client.VerifyIDToken(ctx, idToken)
	if err != nil {
		return nil, err
	}
	return token, nil
}
