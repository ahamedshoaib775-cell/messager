package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

// NovaLink WebSocket Gateway & REST Server in Go
type Message struct {
	ID        string `json:"id"`
	ChatID    string `json:"chatId"`
	Sender    string `json:"sender"`
	Text      string `json:"text"`
	Cipher    string `json:"cipher"`
	Timestamp int64  `json:"timestamp"`
	IsMesh    bool   `json:"isMesh"`
}

type Client struct {
	ID   string
	Conn *websocket.Conn
	Send chan Message
}

type Hub struct {
	clients    map[string]*Client
	broadcast  chan Message
	register   chan *Client
	unregister chan *Client
	mu         sync.Mutex
}

func newHub() *Hub {
	return &Hub{
		clients:    make(map[string]*Client),
		broadcast:  make(chan Message),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client.ID] = client
			h.mu.Unlock()
			log.Printf("Client connected: %s", client.ID)

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client.ID]; ok {
				delete(h.clients, client.ID)
				close(client.Send)
				log.Printf("Client disconnected: %s", client.ID)
			}
			h.mu.Unlock()

		case message := <-h.broadcast:
			h.mu.Lock()
			for _, client := range h.clients {
				select {
				case client.Send <- message:
				default:
					close(client.Send)
					delete(h.clients, client.ID)
				}
			}
			h.mu.Unlock()
		}
	}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func main() {
	hub := newHub()
	go hub.run()

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":            "healthy",
			"active_sockets":    len(hub.clients),
			"version":           "2.4.0",
			"novamesh_protocol": "active",
			"timestamp":         time.Now().Unix(),
		})
	})

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println("Upgrade error:", err)
			return
		}
		clientID := fmt.Sprintf("client_%d", time.Now().UnixNano())
		client := &Client{ID: clientID, Conn: conn, Send: make(chan Message, 256)}
		hub.register <- client

		defer func() {
			hub.unregister <- client
			conn.Close()
		}()

		for {
			var msg Message
			err := conn.ReadJSON(&msg)
			if err != nil {
				break
			}
			msg.Timestamp = time.Now().Unix()
			hub.broadcast <- msg
		}
	})

	fmt.Println("⚡ NovaLink Go Gateway listening on :8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
