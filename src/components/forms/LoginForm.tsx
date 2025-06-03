import { Button, Flex, Typography } from "antd";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../Auth/msalConfig";

const { Text, Title } = Typography;

function LoginForm() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  return (
    <Flex
      vertical
      align="center"
      gap="large"
      style={{ maxWidth: 450, width: "100%" }}
    >
      <Title level={4}>Welcome Back!</Title>
      <Text className="text-lg">
        Please sign in to continue to your account
      </Text>
      <Button
        type="primary"
        size="large"
        onClick={handleLogin}
        style={{ width: "90%", height: "48px", fontSize: "16px" }}
      >
        Sign In
      </Button>
    </Flex>
  );
}

export default LoginForm;
