package routes

import (
	"fmt"
	"io"
	"net/http"
)

var camStorage []byte
var screenStorage []byte

func sendRecordings(w http.ResponseWriter, r *http.Request) {
	email := r.URL.Query().Get("email")
	cType := r.URL.Query().Get("type")

	data, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusBadRequest)
		return
	}

	if cType == "cam" {
		camStorage = append(camStorage, data...)
	} else {
		screenStorage = append(screenStorage, data...)
	}
	defer r.Body.Close()
	fmt.Println("Received recording :", len(data), email, cType)
	w.WriteHeader(http.StatusOK)
}

func RecordRoutes(m *http.ServeMux) {
	m.HandleFunc("POST /record/send", sendRecordings)
	m.HandleFunc("GET /record/getcam", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "video/webm")
		w.Header().Set("content-length", fmt.Sprintf("%d", len(camStorage)))
		w.Write(camStorage)
	})
	m.HandleFunc("GET /record/getscreen", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "video/webm")
		w.Header().Set("content-length", fmt.Sprintf("%d", len(screenStorage)))
		w.Write(screenStorage)
	})
}
