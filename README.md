# Mobile Almendros

Mobile application for Almendros project using React Native with Expo.

## Project Overview

This mobile application allows clients to:
- Register and login to their accounts
- View their orders and order details
- Check their profile information
- Cancel orders that are in pending or processing status

## Technologies Used

- React Native 0.79.2
- React 19.0.0
- Expo 53
- TypeScript
- Expo Router for navigation
- Axios for API requests
- Lucide React Native for icons
- Expo Secure Store for secure storage

## Project Structure

```
mobile-almendros/
├── api/             # API configuration and setup
├── app/             # Screens and navigation (Expo Router)
│   ├── (auth)/      # Authentication screens
│   ├── (tabs)/      # Main app tabs and screens
├── assets/          # Images, fonts, etc.
├── components/      # Reusable UI components
├── constants/       # App constants, colors, etc.
├── features/        # Feature-specific code
│   ├── auth/        # Authentication feature
│   ├── orders/      # Orders feature
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
```

## Setup and Installation

### Prerequisites

- Node.js (version 22.15.0 or higher)
- npm or yarn
- Expo CLI
- Android Studio or Xcode for emulators

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/gabo8191/frontend-almendros.git
cd frontend-almendros
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

4. Run on a device or emulator:
```bash
# For iOS
npm run ios
# or
yarn ios

# For Android
npm run android
# or
yarn android
```

## Environment Configuration

The application is configured to connect to the backend API. The API base URL is set in `api/config.ts`. Update this to match your backend server:

```typescript
// api/config.ts
export const API_URL = 'https://api.backend-almendros.com';
export const API_TIMEOUT = 15000; // 15 seconds
```

## Features

### Authentication

- Login with cedula and password
- User registration
- Secure token storage
- Automatic redirection based on authentication status

### Orders Management

- View list of all orders
- View order details
- Order status tracking
- Cancel orders in pending or processing status

### Profile Management

- View user profile information
- Log out functionality

## API Integration

The application is designed to work with the backend API. All API requests are handled through Axios and are configured in the respective service files:

- `features/auth/api/authService.ts`
- `features/orders/api/ordersService.ts`

## Testing

To run the application in development mode:

```bash
npm start
```

This will start the Expo development server. You can then run the app on:

- iOS Simulator (requires macOS and Xcode)
- Android Emulator (requires Android Studio)
- Physical device using the Expo Go app

## Building for Production

To build the app for production:

1. For Android:
```bash
expo build:android
```

2. For iOS:
```bash
expo build:ios
```

## Contributing

1. Create a feature branch from the `develop` branch
2. Make your changes
3. Submit a pull request to the `develop` branch

## Related Projects

- Backend: [https://github.com/gabo8191/backend-almendros](https://github.com/gabo8191/backend-almendros)
- Frontend: [https://github.com/gabo8191/frontend-almendros](https://github.com/gabo8191/frontend-almendros)
