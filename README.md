# twilioApp
Created by Angela Zhou and Michelle Lee

This is a full-stack application that uses both Twilio services and a flight API. A user can receive instant flight updates by texting the Twilio phone number.

To use Twilio services:
1. Sign up for a Twilio phone number and config key
2. Sign up for Aviation Edge API.
3. Download ngrok
4. Run ngrok: ./ngrok http 3000
5. When ngrok starts up, it will assign a unique URL to your tunnel. Paste this link in webhook.
6. Install dependencies with npm install
7. Set up config file with Twilio accountSid, Twilio authToken, aviation-edge API key.
8. Run server with npm start
9. Text flight number to Twilio phone number for instant status on flight

To use browser application:
1. Install dependencies with npm install
2. Run webpack with npm run build
3. Run server with npm start
4. Input flight info into the Mongo database by clicking Submit