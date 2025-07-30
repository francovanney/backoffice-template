import { getAuth } from "firebase/auth";
import { app } from "./firebaseConfig/firebase";

const auth = getAuth(app);
const API_URL = import.meta.env.VITE_SERVER_API;

export const refreshToken = async (): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return false;
    }

    const idToken = await user.getIdToken(true); // Force refresh
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      console.error("Error refreshing token:", response.status);
      return false;
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.token);
    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
};

export const getValidToken = async (): Promise<string | null> => {
  let token = localStorage.getItem("accessToken");

  if (!token) {
    const refreshed = await refreshToken();
    if (refreshed) {
      token = localStorage.getItem("accessToken");
    }
  }

  return token;
};
