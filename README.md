# My App

A modern React application with user authentication, profile management, and user administration features.

## Features

- 🔐 **User Authentication**: Register and login functionality
- 👤 **Profile Management**: Update user profile and settings
- 📋 **User List**: View and manage users
- 🎨 **Modern UI**: Built with Tailwind CSS for responsive design
- 🔔 **Toast Notifications**: Real-time feedback with React Toastify
- 🛣️ **Routing**: Client-side routing with React Router

## Tech Stack

- **React** 18.3.1 - UI framework
- **React Router DOM** 6.26.2 - Client-side routing
- **Axios** 1.13.2 - HTTP client for API requests
- **Tailwind CSS** 3.4.18 - Utility-first CSS framework
- **React Toastify** 11.0.5 - Toast notifications
- **React Scripts** 5.0.1 - Build tools and configurations

## Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- npm or yarn package manager
- Backend API server running (if applicable)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure API endpoints:
   - Update API base URL in `src/api/` if needed

## Available Scripts

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## Project Structure

```
my-app/
├── public/             # Static files
├── src/
│   ├── api/           # API integration
│   ├── components/    # Reusable components (Navbar, etc.)
│   ├── context/       # React Context (UserContext)
│   ├── pages/         # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ProfileSettings.jsx
│   │   └── UserList.jsx
│   ├── App.js         # Main app component with routes
│   └── index.js       # App entry point
├── package.json       # Dependencies and scripts
└── tailwind.config.js # Tailwind CSS configuration
```

## Routes

- `/register` - User registration page
- `/login` - User login page
- `/dashboard` - Main dashboard
- `/profile` - User profile settings
- `/users` - User list management

## Configuration

### Tailwind CSS

Tailwind is configured via `tailwind.config.js` and `postcss.config.js`. Custom styles can be added to `src/index.css`.

### Toast Notifications

Toast notifications are configured in `src/index.js` with the following settings:
- Position: top-right
- Auto-close: 2500ms
- Theme: colored

## Development

1. Start the development server:
```bash
npm start
```

2. Make your changes in the `src/` directory

3. The app will hot-reload automatically

## Building for Production

1. Create an optimized production build:
```bash
npm run build
```

2. The build files will be in the `build/` directory

3. Deploy the contents of the `build/` directory to your hosting service

## Troubleshooting

### Common Issues

1. **Port already in use**: If port 3000 is already in use, you can specify a different port:
   ```bash
   PORT=3001 npm start
   ```

2. **API connection errors**: Verify your backend API is running and the API endpoint is correctly configured

3. **Build fails**: Clear `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Learn More

- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
