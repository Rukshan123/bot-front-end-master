import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import apiService from "../../services/api";
import { loginRequest } from "../../Auth/msalConfig";
import Loader from "../common/Loader";
import { message } from "antd";

const ValidateInvitation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { instance } = useMsal();
    const [error, setError] = useState<string | null>(null);
    const hasValidated = useRef(false);

    useEffect(() => {
        if (hasValidated.current) return;
        hasValidated.current = true;
        const validateToken = async () => {
            const token = searchParams.get("token");
            if (!token) {
                setError("Invitation token is missing.");
                return;
            }

            try {
                const response = await apiService.validateInvitation(token);
                sessionStorage.setItem("invitationToken", token);
                sessionStorage.setItem(
                    "invitationData",
                    JSON.stringify(response.data.data)
                );

                await instance.loginRedirect({
                    ...loginRequest,
                    state: JSON.stringify({ isInvitation: true }),
                });
            } catch (err: any) {
                const errorMessage =
                    err.response?.data?.message ||
                    "Invalid or expired invitation token.";
                setError(errorMessage);
                message.error(errorMessage);
            }
        };

        validateToken();
    }, [searchParams, instance, navigate]);

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-500 text-center">
                    <h1 className="text-2xl font-bold">Invitation Error</h1>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return <Loader fullScreen tip="Validating invitation..." />;
};

export default ValidateInvitation;
