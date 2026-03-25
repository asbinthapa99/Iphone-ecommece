import type { CapacitorConfig } from '@capacitor/cli'

const isProd = process.env.NODE_ENV === 'production'

const config: CapacitorConfig = {
  appId: 'com.inexanepal.app',
  appName: 'Inexa Nepal',
  // webDir is used for static builds — we use server URL mode instead
  webDir: 'out',

  server: {
    // For development: points to local Next.js server
    // For production: change to your Vercel/Railway URL
    url: isProd
      ? 'https://inexanepal.com'
      : 'http://YOUR_MAC_IP:3000', // e.g. http://192.168.1.105:3000
    cleartext: true, // Allow HTTP in dev
    // Allow all navigation within the app
    allowNavigation: ['*.inexanepal.com', 'localhost:3000'],
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      launchAutoHide: true,
      backgroundColor: '#060d0a',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'DARK', // White text on dark background
      backgroundColor: '#060d0a',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },

  ios: {
    scheme: 'Inexa Nepal',
    contentInset: 'automatic',
    backgroundColor: '#ffffff',
    allowsLinkPreview: false,
  },

  android: {
    backgroundColor: '#ffffff',
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false, // set true for dev
  },
}

export default config
