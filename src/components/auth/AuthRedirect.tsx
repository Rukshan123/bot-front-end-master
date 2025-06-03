import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../Auth/msalConfig";
import axios from "axios";
import Loader from "../common/Loader";
import { message } from "antd";

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

      try {
        const response = await instance.acquireTokenSilent({
          ...loginRequest,
          account: user,
        });

        const accessToken = response.accessToken;

        const checkUserResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            withCredentials: false,
          }
        );

        const apiUserData = checkUserResponse.data.data;
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
        if (error.code === "ERR_NETWORK") {
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
