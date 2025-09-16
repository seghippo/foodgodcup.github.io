# Firebase Setup Guide

## 🚀 Quick Setup (5 minutes)

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `sports-league-next` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore Database
1. In your Firebase project, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

### 3. Get Configuration
1. Click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps" section
3. Click "Web" icon `</>`
4. Enter app nickname: `sports-league-web`
5. Click "Register app"
6. Copy the `firebaseConfig` object

### 4. Update Configuration
Replace the placeholder config in `lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

### 5. Set Up Security Rules (Important!)
In Firestore Database → Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all documents (for development)
    // In production, you should add proper authentication
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 🎯 What This Gives You

✅ **Real-time sync** - Changes appear instantly on all devices  
✅ **No manual steps** - Everything happens automatically  
✅ **Free tier** - 50,000 reads, 20,000 writes per day  
✅ **Cross-device** - Works on mobile, tablet, computer  
✅ **Reliable** - Google's infrastructure  

## 🔧 How It Works

1. **Captain creates game** → Automatically saved to Firebase
2. **Captain submits result** → Automatically saved to Firebase  
3. **Other devices** → Automatically fetch latest data
4. **Real-time updates** → Changes appear instantly

## 🚨 Important Notes

- **Test mode** allows anyone to read/write (good for development)
- **Production** should use proper authentication rules
- **Free tier** is generous for a small league (7 teams, 21 games)
- **Data persists** even if you close the browser

## 🆘 Troubleshooting

**"Firebase not initialized"** → Check your config in `lib/firebase.ts`  
**"Permission denied"** → Check Firestore security rules  
**"Network error"** → Check internet connection  
**"No data showing"** → Run the app and create some test data first  

## 📱 Testing Cross-Device Sync

1. Open the app on your computer
2. Create a test game as captain
3. Open the app on your phone
4. Refresh the schedule page
5. The new game should appear instantly!

---

**That's it!** Your sports league now has a real cloud database with automatic cross-device synchronization. No more manual file uploads or localStorage limitations! 🎉
