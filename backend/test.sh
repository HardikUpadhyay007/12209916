#!/run/current-system/sw/bin/bash

# Test creating a short URL
echo "Creating a short URL..."
CREATE_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"url": "https://www.google.com"}' http://localhost:3000/shorturls)
echo "Response: $CREATE_RESPONSE"
SHORT_CODE=$(echo $CREATE_RESPONSE | grep -o '"shortLink":"[^"]*' | grep -o '[^/]*$')

if [ -z "$SHORT_CODE" ]; then
    echo "Failed to create short URL."
    exit 1
fi

echo "Short code is: $SHORT_CODE"
echo "----------------------------------"

# Test redirecting
echo "Testing redirect..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/$SHORT_CODE
echo ""
echo "----------------------------------"


# Test getting stats
echo "Getting stats for the short URL..."
curl -s http://localhost:3000/shorturls/$SHORT_CODE
echo ""
echo "----------------------------------"

# Test creating a custom short URL
echo "Creating a custom short URL..."
curl -s -X POST -H "Content-Type: application/json" -d '{"url": "https://www.github.com", "shortcode": "mygith"}' http://localhost:3000/shorturls
echo ""
echo "----------------------------------"

# Test using an invalid URL
echo "Testing with an invalid URL..."
curl -s -X POST -H "Content-Type: application/json" -d '{"url": "invalid-url"}' http://localhost:3000/shorturls
echo ""
echo "----------------------------------"

# Test using an expired URL (This will require manual DB edit to test properly)
echo "To test expired URL, manually set the 'expiresAt' field in the database to a past date for a shortcode."
