package routes

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/golang-jwt/jwt/v5"
)

// to get access token from github
func getAccessToken(client *http.Client, code string) string {
	baseUrl := "https://github.com/login/oauth/access_token"
	rawData := map[string]string{
		"client_id":     os.Getenv("GITHUB_CLIENT_ID"),
		"client_secret": os.Getenv("GITHUB_CLIENT_SECRET"),
		"code":          code,
		"redirect_uri":  "http://localhost:8000/auth/callback/github",
	}

	//marshaling into json
	jsonData, err := json.Marshal(rawData)
	if err != nil {
		log.Fatal("Error marshalling", err)
	}

	//put request to get access token from github
	tokenPostReq, err := http.NewRequest("POST", baseUrl, bytes.NewBuffer(jsonData))
	if err != nil {
		log.Fatal("Error creating POST request:", err)
	}
	tokenPostReq.Header.Set("content-type", "application/json")
	tokenPostReq.Header.Set("Accept", "application/json")

	tokenPostRes, err := client.Do(tokenPostReq)
	if err != nil {
		log.Fatal("error making put request", err)
	}

	accessJsonData, err := io.ReadAll(tokenPostRes.Body)
	if err != nil {
		log.Fatal("error reading put response", err)
	}

	// Unmarshalling access token
	accessData := map[string]string{}
	err = json.Unmarshal(accessJsonData, &accessData)
	if err != nil {
		log.Fatal("error unmarshalling access data :", err)
	}

	return accessData["access_token"]
}

// to get user data from github
func getUserData(client *http.Client, accessToken string) map[string]interface{} {
	//get user data using access tocken
	githubUserApiReq, err := http.NewRequest("GET", "https://api.github.com/user", nil)
	if err != nil {
		log.Fatal("Error creating GET request:", err)
	}
	githubUserApiReq.Header.Set("Authorization", "token "+accessToken)
	githubUserApiReq.Header.Set("Accept", "application/json")

	githubUserApiRes, err := client.Do(githubUserApiReq)
	if err != nil {
		log.Fatal("error making get request", err)
	}

	userJsonData, err := io.ReadAll(githubUserApiRes.Body)
	if err != nil {
		log.Fatal("error reading get response", err)
	}

	//unmarshalling user data
	userData := map[string]interface{}{}
	err = json.Unmarshal(userJsonData, &userData)
	if err != nil {
		log.Fatal("error unmarshalling userdata :", err)
	}
	return userData
}

// to handle the callback from github
func handleGithubCallback(w http.ResponseWriter, r *http.Request) {
	client := &http.Client{}
	code := r.URL.Query().Get("code")

	accessToken := getAccessToken(client, code)

	userData := getUserData(client, accessToken)

	fmt.Fprintln(w, "user data : ", userData)
}

func createJwtToken(userData map[string]interface{}) string {
	algo := jwt.GetAlgorithms()
	fmt.Println("algorithms : ", algo)
	return algo[0]
}

// to redirect to github auth page
func redirectToGihubAuth(w http.ResponseWriter, r *http.Request) {
	baseUrl := "https://github.com/login/oauth/authorize"
	clientID := os.Getenv("GITHUB_CLIENT_ID")
	redirectUri := "http://localhost:8080/auth/callback/github"
	state := "a9yu1nqjn3oirh3i2hn"

	finalUrl := baseUrl + "?client_id=" + clientID + "&redirect_uri=" + redirectUri + "&state=" + state

	http.Redirect(w, r, finalUrl, http.StatusTemporaryRedirect)
}

// base url /auth/
func AuthRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /auth/github", redirectToGihubAuth)
	mux.HandleFunc("GET /auth/callback/github", handleGithubCallback)
}
