package routes

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// to sign jwt token
func signJwtToken(userData map[string]interface{}) (string, error) {

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"name":    userData["name"],
		"profile": userData["avatar_url"],
		"exp":     jwt.NewNumericDate(time.Now().Add(7 * 24 * time.Hour)),
	})

	secret := os.Getenv("JWT_SECRET")

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

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

	jwtToken, err := signJwtToken(userData)
	if err != nil {
		http.Error(w, "error signing jwt token", http.StatusInternalServerError)
		return
	}

	//set cookie for 1 week
	cookie := &http.Cookie{
		Name:    "jwt",
		Value:   jwtToken,
		Expires: time.Now().Add(7 * 24 * time.Hour),
		MaxAge:  7 * 24 * 60 * 60,
	}
	http.SetCookie(w, cookie)
	w.Write([]byte("cookie set successfully"))
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

// to get user details
func getUserDetails(w http.ResponseWriter, r *http.Request) {
	jwtCookie, err := r.Cookie("jwt")
	if err != nil {
		http.Error(w, "unauthorized access", http.StatusUnauthorized)
		return
	}

	jwtString := jwtCookie.Value

	token, err := jwt.Parse(jwtString, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil || !token.Valid {
		http.Error(w, "unauthorized access", http.StatusUnauthorized)
		return
	}

	userData := token.Claims.(jwt.MapClaims)

	jsonUserData, err := json.Marshal(userData)
	if err != nil {
		http.Error(w, "error marshalling user data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonUserData)
}

// routes to handle auth
func AuthRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /auth/github", redirectToGihubAuth)
	mux.HandleFunc("GET /auth/callback/github", handleGithubCallback)
	mux.HandleFunc("GET /auth/user", getUserDetails)
}
