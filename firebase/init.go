package firebase

import (
	"context"
	"encoding/base64"
	"log"
	"os"

	firebase "firebase.google.com/go"

	"google.golang.org/api/option"
)

func NewApp() *firebase.App {
	credentials, err := base64.StdEncoding.DecodeString(os.Getenv("FIREBASE_CRED"))
	if err != nil {
		log.Fatalf("Base64 decoding error: %v", err)
	}
	opt := option.WithCredentialsJSON(credentials)
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatalf("error connecting to firebase: %v", err)
	}
	return app
}
