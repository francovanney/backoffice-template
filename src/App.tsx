import { useEffect, useState, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import * as Tooltip from "@radix-ui/react-tooltip";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

import { app } from "./lib/firebaseConfig/firebase";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import { ModalProvider } from "./components/ModalManager";

import GlobalLayout from "./views/GlobalLayout";
import Header from "./views/Header";
import Login from "./components/Login";
import LeftMenu from "./views/LeftMenu";
import Filter from "./components/Filter";

const auth = getAuth(app);

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(search, 600);
  const API_URL = import.meta.env.VITE_SERVER_API;

  const sendTokenToBackend = useCallback(
    async (firebaseUser: User, forceRefresh = false) => {
      try {
        const idToken = await firebaseUser.getIdToken(forceRefresh);
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
      } catch (err: any) {
        console.error("Error refreshing token:", err);
        return false;
      }
    },
    [API_URL]
  );

  const setupTokenRefresh = useCallback(
    (firebaseUser: User) => {
      const refreshInterval = setInterval(async () => {
        console.log("Refreshing token automatically...");
        await sendTokenToBackend(firebaseUser, true);
      }, 50 * 60 * 1000);

      return refreshInterval;
    },
    [sendTokenToBackend]
  );

  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;

    const unsubscribe = onAuthStateChanged(auth, async (userLogged) => {
      if (userLogged) {
        setUser(userLogged);
        localStorage.setItem("user", JSON.stringify(userLogged));

        const hasToken = localStorage.getItem("accessToken");
        if (!hasToken) {
          await sendTokenToBackend(userLogged);
        }

        refreshInterval = setupTokenRefresh(userLogged);
      } else {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");

        if (refreshInterval) {
          clearInterval(refreshInterval);
        }
      }

      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [sendTokenToBackend, setupTokenRefresh]);

  return (
    <Tooltip.Provider>
      <ModalProvider>
        <div>
          <Toaster />
          {!isLoading &&
            (user ? (
              <>
                <div className="fixed top-0 left-0 w-full z-50">
                  <Header email={user?.email ?? ""} />
                </div>
                <main className="w-full h-screen pt-16 overflow-hidden flex">
                  <LeftMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

                  {menuOpen && (
                    <div
                      className="fixed inset-0 bg-black/30 z-30 md:hidden"
                      onClick={() => setMenuOpen(false)}
                    />
                  )}

                  <div className="flex-1 h-full overflow-hidden flex flex-col md:ml-64">
                    <div className="flex-shrink-0 bg-white border-b">
                      <Filter search={search} setSearch={setSearch} />
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <GlobalLayout search={debouncedSearch} />
                    </div>
                  </div>
                </main>
              </>
            ) : (
              <Login />
            ))}
        </div>
      </ModalProvider>
    </Tooltip.Provider>
  );
};

export default App;
