# URL Shortener Microservice

This project is a robust HTTP URL Shortener Microservice built with Bun.js, TypeScript, Express, and MongoDB. It provides core URL shortening functionality with basic analytical capabilities.

## Features

- Shorten long URLs to a concise, easy-to-share format.
- Custom shortcodes for personalized links.
- Set expiration times for temporary URLs.
- Track click analytics, including IP address, user agent, and referrer.
- Retrieve detailed statistics for each shortened URL.

## Technology Stack

- **Runtime:** Bun.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Libraries:** `nanoid` for shortcode generation, `validator` for URL validation.

## Project Structure

```
/
├── src/
│   ├── config/
│   │   └── db.ts           # Database connection
│   ├── controllers/
│   │   └── urlController.ts # Request handlers
│   ├── middleware/
│   │   └── errorHandler.ts # Error handling middleware
│   ├── models/
│   │   ├── Log.ts          # Log data model
│   │   └── Url.ts          # URL data model
│   ├── routes/
│   │   └── urlRoutes.ts    # API routes
│   └── utils/
│       ├── logger.ts       # Logging utility
│       └── url.ts          # URL helper functions
├── .env                    # Environment variables
├── package.json
├── tsconfig.json
└── test.sh                 # Test script
```

## Getting Started

### Prerequisites

- [Bun.js](https://bun.sh/)
- [MongoDB](https://www.mongodb.com/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**

    ```bash
    bun install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following:
    ```
    MONGO_URI=mongodb://localhost:27017/url-shortener
    PORT=3000
    LOG_API_ENDPOINT=http://localhost:4000/logs
    ```
    The `LOG_API_ENDPOINT` is optional and used for sending logs to a test server.

### Running the Application

```bash
bun src/index.ts
```

The server will start on port 3000 by default.

## API Documentation

### Create a Short URL

- **Endpoint:** `POST /shorturls`
- **Description:** Creates a new short URL.
- **Request Body:**
  ```json
  {
    "url": "https://example.com/very/long/url/to/shorten",
    "validity": 60, // Optional, in minutes. Defaults to 30.
    "shortcode": "custom" // Optional, custom shortcode.
  }
  ```
- **Success Response (201):**
  ```json
  {
    "shortLink": "http://localhost:3000/custom",
    "expiresAt": "2025-07-14T12:00:00.000Z"
  }
  ```
- **Error Responses:**
  - `400 Bad Request`: Invalid URL or shortcode format.
  - `409 Conflict`: Custom shortcode is already in use.
  - `500 Internal Server Error`: Server-side error.

### Redirect to Original URL

- **Endpoint:** `GET /:shortcode`
- **Description:** Redirects to the original URL associated with the shortcode.
- **Success Response (302):**
  - Redirects to the original URL.
- **Error Responses:**
  - `404 Not Found`: Shortcode not found or expired.

### Get URL Statistics

- **Endpoint:** `GET /shorturls/:shortcode`
- **Description:** Retrieves usage statistics for a short URL.
- **Success Response (200):**
  ```json
  {
    "originalUrl": "https://example.com",
    "createdAt": "2025-07-14T11:00:00.000Z",
    "expiresAt": "2025-07-14T12:00:00.000Z",
    "clickCount": 5,
    "clicks": [
      {
        "timestamp": "2025-07-14T11:05:10.000Z",
        "ip": "127.0.0.1",
        "userAgent": "Mozilla/5.0...",
        "referrer": "https://google.com",
        "location": { "city": "Unknown", "country": "Unknown" }
      }
    ]
  }
  ```
- **Error Responses:**
  - `404 Not Found`: Shortcode not found.

## Testing

A simple test script is provided to verify the basic functionality of the endpoints.

```bash
chmod +x test.sh
./test.sh
```

This script will:

1.  Create a short URL.
2.  Test the redirect.
3.  Fetch the statistics for the created URL.
4.  Attempt to create a custom short URL.
5.  Test error handling for an invalid URL.
