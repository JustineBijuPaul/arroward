# Arroward Backend Documentation

## Overview
Arroward is a full-stack service marketplace platform connecting international clients with local workers for various services such as farm land maintenance, home cleaning, and specialized tasks like house painting and coconut tree climbing.

## Technology Stack
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT-based authentication
- **Real-Time Updates**: WebSocket or Firebase
- **Payment Integration**: Stripe/PayPal

## Features
- **User Authentication**: Secure sign-up and login for clients and managers.
- **Property Management**: Clients can manage multiple properties.
- **Service Request System**: Clients can post job requests and track quotations.
- **Manager Operations**: Managers can accept job requests, manage workers, and handle payments.
- **Admin Control**: Super Admin can manage users, services, and data.

## File Structure
- **src/config**: Configuration files (e.g., database connection).
- **src/controllers**: Business logic for handling requests.
- **src/middleware**: Middleware for authentication and validation.
- **src/models**: Mongoose models for database schemas.
- **src/routes**: API routes for different functionalities.
- **src/services**: Services for email notifications and payment processing.
- **src/app.js**: Main application setup.
- **src/server.js**: Server entry point.

## Installation
1. Clone the repository.
2. Navigate to the `backend` directory.
3. Run `npm install` to install dependencies.
4. Set up your MongoDB connection in `src/config/database.js`.
5. Start the server with `node src/server.js`.

## Usage
- Access the API endpoints as defined in the routes.
- Use Postman or similar tools for testing the API.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.