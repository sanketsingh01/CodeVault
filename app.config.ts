import type { ExpoConfig } from "expo/config";

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return "com.sanket005.CodeVault.dev";
  }

  if (IS_PREVIEW) {
    return "com.sanket005.CodeVault.preview";
  }

  return "com.sanket005.CodeVault";
};

const getAppName = () => {
  if (IS_DEV) {
    return "CodeVault (Dev)";
  }

  if (IS_PREVIEW) {
    return "CodeVault (Preview)";
  }

  return "CodeVault";
}

export default {
  "expo": {
    "name": getAppName(),
    "slug": "CodeVault",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "codevault",
    "userInterfaceStyle": "automatic",
    "ios": {
      "icon": "./assets/expo.icon",
      "bundleIdentifier": getUniqueIdentifier(),
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "predictiveBackGestureEnabled": false,
      "package": getUniqueIdentifier(),
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#208AEF",
          "android": {
            "image": "./assets/images/splash-icon.png",
            "imageWidth": 76
          }
        }
      ],
      "expo-sqlite",
      "expo-sharing",
      "expo-secure-store"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "e68d6447-7d67-4469-945f-bb36156584fd"
      }
    }
  } satisfies ExpoConfig
}
