import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import * as Tooltip from "@radix-ui/react-tooltip";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

import { app } from "./lib/firebaseConfig/firebase";

import GlobalLayout from "./views/GlobalLayout";
import Header from "./views/Header";
import Login from "./components/Login";

const auth = getAuth(app);

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_SERVER_API;

  const sendTokenToBackend = async (firebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken();
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.token);
    } catch (err: any) {
      if (err && err.code) {
        console.error(
          "Firebase error code:",
          err.code,
          "message:",
          err.message
        );
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userLogged) => {
      if (userLogged) {
        setUser(userLogged);
        localStorage.setItem("user", JSON.stringify(userLogged));

        const hasToken = localStorage.getItem("accessToken");
        if (!hasToken) {
          await sendTokenToBackend(userLogged);
        }
      } else {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Tooltip.Provider>
      <div>
        <Toaster />
        {!isLoading &&
          (user ? (
            <>
              <div className="fixed top-0 left-0 w-full z-50">
                <Header email={user?.email ?? ""} />
              </div>
              <main className="w-full flex-1 flex min-h-0 p-0 m-0 overflow-hidden">
                <GlobalLayout />
              </main>
            </>
          ) : (
            <Login />
          ))}
      </div>
    </Tooltip.Provider>
  );
};

export default App;
