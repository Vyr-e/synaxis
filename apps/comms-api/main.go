package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("Synaxis Communications API")
	fmt.Println("• WebSocket (Chat Rooms)")
	fmt.Println("• WebRTC (Media Streaming)")
	fmt.Println("Server starting on :8080")

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Synaxis Communications API")
	})

	log.Fatal(http.ListenAndServe(":8080", nil))

	// TODO: Add WebRTC and WebSocket APIs
	// Remember:
	// apps/comms-api/
	fmt.Println(`
	└── comms-api/
		├── main.go          # Entry point
		├── go.mod          # Go module file
		├── internal/       # Internal packages
		│   ├── chat/       # WebSocket chat handling
		│   ├── webrtc/     # WebRTC media handling
		│   └── config/     # Configuration
		├── pkg/           # Shared packages
		│   ├── db/        # Database connections
		│   └── ws/        # WebSocket utilities
		└── api/           # API routes and handlers
			├── chat/      # Chat endpoints
			└── media/     # Media endpoints
		`)
}
