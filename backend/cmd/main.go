package main

import (
	"fmt"
	"log"
	"net/http"
	"server/internal/routes"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// Register routes
	mux := http.NewServeMux()
	routes.AuthRoutes(mux)

	fmt.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		panic(err)
	}
}
