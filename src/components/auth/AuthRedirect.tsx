import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../Auth/msalConfig";
import Loader from "../common/Loader";
import { message } from "antd";
import apiService from "../../services/api";

const AuthRedirect = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { instance, accounts } = useMsal();
    const [messageApi, contextHolder] = message.useMessage();

    const invitationDataString = sessionStorage.getItem("invitationData");
    const invitationData = invitationDataString
        ? JSON.parse(invitationDataString)
        : null;

    const isEmailIvitation =
        typeof invitationData?.email === "string" &&
        invitationData.email.trim().length > 0;

    console.error("Email from invitationData:", invitationData?.email);
    console.error("isEmailIvitation:", isEmailIvitation);

    useEffect(() => {
        const checkExistingUser = async () => {
            const user = accounts[0];

            console.error(
                !user && isEmailIvitation == false,
                "!user && !isEmailIvitation"
            );

            if (!user && isEmailIvitation == false) {
                navigate("/login");
                return;
            }

            try {
                const response = await instance.acquireTokenSilent({
                    ...loginRequest,
                    account: user,
                });

                const accessToken = response.accessToken;
                const checkUserResponse = await apiService.getUserProfile(
                    accessToken
                );

                const apiUserData = checkUserResponse.data.data;
                sessionStorage.setItem("userData", JSON.stringify(apiUserData));
                const entraIdFromApi = apiUserData?.entra_user_id;
                const oidFromMsal = user.idTokenClaims?.oid;

                console.error(isEmailIvitation);

                if (isEmailIvitation) {
                    navigate("/register-invited-user");
                } else if (
                    entraIdFromApi &&
                    oidFromMsal &&
                    entraIdFromApi === oidFromMsal
                ) {
                    messageApi.success("Welcome back!");
                    navigate("/home", { state: apiUserData });
                } else {
                    // New user case - clear session storage
                    sessionStorage.removeItem("userData");
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
                            messageApi.warning(
                                "Using cached profile data due to network issue"
                            );
                            navigate("/login", { state: userData });
                            return;
                        }
                    } catch (e) {
                        sessionStorage.removeItem("userData");
                        navigate("/login");
                    }
                }

                // Handle API errors
                if (isEmailIvitation) {
                    navigate("/register-invited-user");
                } else {
                    messageApi.error(
                        "An error occurred while checking your profile. Please try again."
                    );
                    navigate("/login");
                }
            }
        };

        checkExistingUser();
    }, [instance, accounts, navigate, messageApi, location]);

    return (
        <>
            {contextHolder}
            <Loader fullScreen tip="" />
        </>
    );
};

export default AuthRedirect;
