# Arroward Project

Arroward is a service marketplace connecting international clients with local workers for various services such as farm land maintenance, home cleaning, and specialized tasks like house painting, blight removal, and coconut tree climbing.

## Project Structure

The project is divided into three main components:

1. **Client-Side Interface (Web App for Clients)**
   - User Authentication
   - Property Management
   - Service Request (Quotation System)
   - Quotation Tracking
   - Payment System
   - Notifications & Updates

2. **Manager-Side Interface (Restricted Access for Local Managers & Admins)**
   - Authentication
   - Quotation Management
   - Job Scheduling
   - Worker Management
   - Task Delegation
   - Payment Distribution

3. **Super Admin Interface (Exclusive Admin Portal)**
   - Global Management
   - Service Management
   - User & Data Control

## Technology Stack

- **Frontend**: React.js (Next.js preferred for SEO optimization), TailwindCSS for styling.
- **Backend**: Node.js with Express.js for API handling.
- **Database**: MongoDB (with Mongoose ORM) for structured data storage.
- **Authentication**: JWT-based authentication for security.
- **Real-Time Updates**: WebSocket or Firebase for instant notifications.
- **Payment Integration**: Stripe/PayPal integration for seamless transactions.
- **Deployment**: Host the frontend on Vercel/Netlify and the backend on AWS/Digital Ocean.

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the backend directory and install dependencies:
   ```
   cd backend
   npm install
   ```

3. Navigate to the client directory and install dependencies:
   ```
   cd client
   npm install
   ```

4. Set up the MongoDB database and update the connection string in `backend/src/config/database.js`.

5. Start the backend server:
   ```
   cd backend
   npm start
   ```

6. Start the client application:
   ```
   cd client
   npm start
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License. See the LICENSE file for details.