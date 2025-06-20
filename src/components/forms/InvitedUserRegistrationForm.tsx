import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";
import { useNavigate } from "react-router-dom";
import { message, Typography } from "antd";
import { loginRequest } from "../../Auth/msalConfig";
import apiService from "../../services/api";
const { Title } = Typography;

function InvitedUserRegistrationForm() {
    const { instance, accounts } = useMsal();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const invitationDataString = sessionStorage.getItem("invitationData");
        const invitationData = invitationDataString
            ? JSON.parse(invitationDataString)
            : null;
        const invitedEmail = invitationData?.email;

        const invitationToken = sessionStorage.getItem("invitationToken");

        console.error(invitationData);
        console.error(invitedEmail);
        console.error(invitationToken);

        if (!invitationData || !invitedEmail || !invitationToken) {
            setError(
                "Invitation data not found. Please use the invitation link again."
            );
            return;
        }

        const user: AccountInfo | undefined = accounts[0];
        const claims = user?.idTokenClaims as Record<string, any>;
        const signedInEmail = claims?.["Org Email"] || "";

        console.error(signedInEmail, "signedInEmail");

        if (!user) {
            // Not signed in, trigger login
            setIsLoading(true);
            instance.loginRedirect({
                scopes: loginRequest.scopes,
                loginHint: invitedEmail,
            });
            return;
        }

        // User is signed in, check email
        if (
            signedInEmail &&
            signedInEmail.toLowerCase() === invitedEmail.toLowerCase()
        ) {
            // Email matches, proceed
            const register = async () => {
                setIsLoading(true);
                try {
                    const response = await instance.acquireTokenSilent({
                        ...loginRequest,
                        account: user,
                    });
                    const accessToken = response.accessToken;
                    const userProfile = {
                        first_name:
                            claims?.["First Name"] || claims?.given_name || "",
                        last_name:
                            claims?.["Last Name"] || claims?.family_name || "",
                        email: signedInEmail,
                        contact_number: claims?.["Contact Number"] || "",
                        address: claims?.["Street Address"] || "",
                        roles: ["MEMBER"],
                    };
                    const requestBody = {
                        user: userProfile,
                        invitation_token: invitationToken,
                    };
                    const apiResponse = await apiService.registerUser(
                        accessToken,
                        requestBody
                    );
                    sessionStorage.setItem(
                        "userData",
                        JSON.stringify(apiResponse.data.data)
                    );
                    messageApi.success("Registration successful!");
                    console.error("register through invite link");
                    setTimeout(
                        () =>
                            navigate("/home", { state: apiResponse.data.data }),
                        1000
                    );
                } catch (error: any) {
                    console.error("Registration error:", error);
                    const errorMessage =
                        error.response?.data?.message ||
                        "Registration failed. Please try again.";
                    setError(errorMessage);
                    messageApi.error(errorMessage);
                } finally {
                    setIsLoading(false);
                }
            };
            register();
        } else {
            // Email does not match, sign out and show error
            setError(
                "You must sign in with the invited email address: " +
                    invitedEmail
            );
            setTimeout(() => {
                instance.logoutRedirect();
            }, 100000);
        }
    }, [accounts, instance, navigate, messageApi]);

    return (
        <div style={{ maxWidth: 450, margin: "0 auto", padding: 32 }}>
            {contextHolder}
            {isLoading && <div>Redirecting to sign in...</div>}
            {error && (
                <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
            )}
            <Title level={2}>Invited User Sign In</Title>
            <p>Please sign in with your invited email address to continue.</p>
        </div>
    );
}

export default InvitedUserRegistrationForm;
