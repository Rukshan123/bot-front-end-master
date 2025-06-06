import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../Auth/msalConfig";
import Loader from "../common/Loader";
import { message } from "antd";
import apiService from "../../services/api";

const AuthRedirect = () => {
  const navigate = useNavigate();
  const { instance, accounts } = useMsal();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const checkExistingUser = async () => {
      const user = accounts[0];

      if (!user) {
        navigate("/vendor-registration");
        return;
      }

      // First check if we have cached user data
      const cachedData = sessionStorage.getItem("userData");
      if (cachedData) {
        try {
          const userData = JSON.parse(cachedData);
          const entraIdFromApi = userData?.entra_user_id;
          const oidFromMsal = user.idTokenClaims?.oid;

          if (entraIdFromApi && oidFromMsal && entraIdFromApi === oidFromMsal) {
            messageApi.success("Welcome back!");
            navigate("/home", { state: userData });
            return;
          }
        } catch (e) {
          // If there's an error parsing the cached data, clear it and continue with API call
          sessionStorage.removeItem("userData");
        }
      }

      try {
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: user,
        });

        const accessToken = response.accessToken;
        const checkUserResponse = await apiService.getUserProfile(accessToken);

        const apiUserData = checkUserResponse.data.data;
        sessionStorage.setItem("userData", JSON.stringify(apiUserData));
        const entraIdFromApi = apiUserData?.entra_user_id;
        const oidFromMsal = user.idTokenClaims?.oid;

        if (entraIdFromApi && oidFromMsal && entraIdFromApi === oidFromMsal) {
          messageApi.success("Welcome back!");
          navigate("/home", { state: apiUserData });
        } else {
          navigate("/vendor-registration");
        }
      } catch (error: any) {
        console.error("Error checking user:", error);
        // Check if we have cached data again in case the error was a timeout
        const cachedData = sessionStorage.getItem("userData");
        if (cachedData) {
          try {
            const userData = JSON.parse(cachedData);
            const entraIdFromApi = userData?.entra_user_id;
            const oidFromMsal = user.idTokenClaims?.oid;

            if (
              entraIdFromApi &&
              oidFromMsal &&
              entraIdFromApi === oidFromMsal
            ) {
              // If we have valid cached data, use it despite the API error
              messageApi.warning(
                "Using cached profile data due to network issue"
              );
              navigate("/home", { state: userData });
              return;
            }
          } catch (e) {
            // If there's an error parsing the cached data, clear it
            sessionStorage.removeItem("userData");
          }
        }

        if (error.code === "ECONNABORTED") {
          messageApi.error(
            "Request timeout. Please check your internet connection and try again."
          );
        } else if (error.code === "ERR_NETWORK") {
          messageApi.error(
            "Network error. The server might be unavailable. Please try again later."
          );
        }
        navigate("/vendor-registration");
      }
    };

    checkExistingUser();
  }, [instance, accounts, navigate, messageApi]);

  return (
    <>
      {contextHolder}
      <Loader fullScreen tip="" />
    </>
  );
};

export default AuthRedirect;
