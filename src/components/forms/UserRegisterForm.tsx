import React from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../Auth/msalConfig";

const RegisterPage = () => {
  const { instance } = useMsal();

  const handleSignup = () => {
    // Option 1: If using combined sign-in/sign-up policy
    instance.loginRedirect(loginRequest);

    // Option 2: If using separate sign-up policy:
    // instance.loginRedirect({
    //   ...loginRequest,
    //   authority: "https://<your-tenant>.ciamlogin.com/<your-signup-policy>"
    // });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Create your SaaSBot account</h1>
      <button
        onClick={handleSignup}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mt-7"
      >
        Sign Up
      </button>
    </div>
  );
};

export default RegisterPage;
