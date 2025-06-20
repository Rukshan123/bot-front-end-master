import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";
import { useNavigate } from "react-router-dom";
import { message, Typography } from "antd";
import { loginRequest } from "../../Auth/msalConfig";
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

        if (!invitationData || !invitedEmail) {
            setError(
                "Invitation data not found. Please use the invitation link again."
            );
            return;
        }

        const user: AccountInfo | undefined = accounts[0];
        const claims = user?.idTokenClaims as Record<string, any>;
        const signedInEmail = claims?.emails?.[0] || claims?.email;

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
            messageApi.success("Sign in successful!");
            setTimeout(() => navigate("/home"), 1000);
        } else {
            // Email does not match, sign out and show error
            setError(
                "You must sign in with the invited email address: " +
                    invitedEmail
            );
            setTimeout(() => {
                instance.logoutRedirect();
            }, 2000);
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
