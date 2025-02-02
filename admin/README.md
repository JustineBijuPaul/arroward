# Arroward Admin Documentation

## Overview
The Arroward Admin application is a crucial component of the Arroward platform, designed for super admins to manage local managers, services, and user data effectively. This application provides a user-friendly interface for performing administrative tasks and ensuring smooth operations within the Arroward ecosystem.

## Features
- **Manager Management**: Add, update, or remove local managers and assign them to specific areas.
- **Service Management**: Dynamically add new services, modify pricing, and update service descriptions.
- **User Control**: Full control over clients, managers, workers, properties, and quotations.
- **Real-Time Notifications**: Receive instant updates on job statuses and other important events.

## Getting Started
To set up the Arroward Admin application locally, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd arroward/admin
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root of the admin directory and configure the necessary environment variables.

4. **Run the Application**
   ```bash
   npm start
   ```

## Directory Structure
The admin application follows a structured directory layout for better organization:

```
admin
├── src
│   ├── components       # React components for the admin interface
│   ├── context          # Context providers for state management
│   ├── hooks            # Custom hooks for reusable logic
│   ├── pages            # Main pages of the admin application
│   ├── services         # API call functions and other services
│   ├── styles           # TailwindCSS styles
│   ├── types            # TypeScript types and interfaces
│   ├── utils            # Utility functions
│   ├── App.tsx         # Main component of the admin application
│   └── index.tsx       # Entry point for the admin application
├── package.json         # Lists dependencies and scripts for the admin application
└── README.md            # Documentation for the admin application
```

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.