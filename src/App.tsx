import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import StartPage from "./components/StartPage";
import LoginForm from "./components/forms/LoginForm";
import UserRegisterForm from "./components/forms/UserRegisterForm";
import VendorRegistrationForm from "./components/forms/VendorRegistrationForm";
import Home from "./components/Navbar/Home";
import Navbar from "./components/Navbar/Nav";
import Agents from "./components/Navbar/Agents";
import Price from "./components/Navbar/Price";
import Tools from "./components/Navbar/Tools";
import CreateAgent from "./components/Agent/CreateAgent/CreateAgent";
import Footer from "./components/Footer/Footer";
import AgentDetailPage from "./components/Agent/AgentDetailPage";

import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { JSX, useEffect } from "react";
import { loginRequest } from "./Auth/msalConfig";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AppContent = () => {
  const location = useLocation();
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const hideNavbarRoutes = ["/", "/login", "/register", "/vendorReg"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  useEffect(() => {
    const logTokens = async () => {
      if (accounts.length > 0) {
        try {
          const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0],
          });

          console.log("Access Token:", response.accessToken);
          console.log("ID Token:", response.idToken);
        } catch (error) {
          console.error("Token acquisition failed:", error);
        }
      }
    };

    logTokens();
  }, [accounts, instance]);

  return (
    <div className="flex-grow px-4 pb-8">
      {shouldShowNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <StartPage child={<LoginForm />} />
            )
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <StartPage child={<LoginForm />} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <StartPage child={<UserRegisterForm />} />
            )
          }
        />
        <Route
          path="/vendorReg"
          element={
            isAuthenticated ? (
              <Navigate to="/home" replace />
            ) : (
              <StartPage child={<VendorRegistrationForm />} />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/createAgent"
          element={
            <ProtectedRoute>
              <CreateAgent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agent/:id"
          element={
            <ProtectedRoute>
              <AgentDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agents"
          element={
            <ProtectedRoute>
              <Agents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/price"
          element={
            <ProtectedRoute>
              <Price />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools"
          element={
            <ProtectedRoute>
              <Tools />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col overflow-x-hidden bg-white">
        <AppContent />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
