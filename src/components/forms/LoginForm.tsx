import { Button, Flex, Typography } from "antd";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../Auth/msalConfig";
import { Link } from "react-router-dom";

const { Text } = Typography;

function LoginForm() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  return (
    <div style={{ maxWidth: 450 }}>
      <Button block type="primary" size="large" onClick={handleLogin}>
        Sign in with Microsoft
      </Button>

      <div className="pt-4" />

      <Flex justify="center" align="center">
        <Link className="font-bold" to="">
          OR
        </Link>
      </Flex>

      <div className="pt-6" />

      <Text>
        Don't have an account?{" "}
        <Link className="underline pl-2" to="/vendorReg">
          Register now!
        </Link>
      </Text>
    </div>
  );
}

export default LoginForm;
