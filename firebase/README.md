# Firebase Configuration

## Setup Instructions

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication methods:
   - **Google** (recommended - one-click sign-in)
   - Email/Password (optional)
4. Create a Firestore Database
5. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Environment Variables

Create a `.env` file in the `frontend/` directory with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Security Rules

The firestore.rules file ensures that only authenticated users can read and write data.

