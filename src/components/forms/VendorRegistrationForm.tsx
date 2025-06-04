import { Button, Form, Input, Col, Row, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";
import { loginRequest } from "../../Auth/msalConfig";
import { useState } from "react";
import Loader from "../common/Loader";
import apiService from "../../services/api";
const { Title } = Typography;

interface VendorFormData {
  name: string;
  email: string;
  contact: string;
  adress: string;
}

function VendorRegistrationForm() {
  const navigate = useNavigate();
  const { instance, accounts } = useMsal();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);

  const user: AccountInfo | undefined = accounts[0];
  const claims = user?.idTokenClaims as Record<string, any>;

  const firstName = claims?.["First Name"] || "";
  const lastName = claims?.["Last Name"] || "";
  const email = claims?.preferred_username || "";
  const contact = claims?.["Contact Number"] || "";
  const address = `${claims?.["Street Address"] || ""}, ${
    claims?.City || ""
  }, ${claims?.["Postal Code"] || ""}`;
  const roles = ["ADMIN"];

  const onFinish = async (values: VendorFormData) => {
    setIsLoading(true);
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: user,
      });

      const accessToken = response.accessToken;

      const requestBody = {
        vendor: {
          name: values.name,
          email: values.email,
          contact_number: values.contact,
          address: values.adress,
        },
        user: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          contact_number: contact,
          address: address,
          roles: roles,
        },
      };

      const apiResponse = await apiService.registerUser(
        accessToken,
        requestBody
      );

      sessionStorage.removeItem("userData");
      sessionStorage.setItem("userData", JSON.stringify(apiResponse.data.data));

      messageApi.success("Registration successful!");
      navigate("/home", { state: apiResponse.data.data });
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.code === "ERR_NETWORK") {
        messageApi.error(
          "Network error. The server might be unavailable. Please try again later."
        );
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
        messageApi.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      {isLoading && <Loader fullScreen tip="" />}
      <Form
        name="form_item_path"
        layout="vertical"
        style={{ maxWidth: 450 }}
        onFinish={onFinish}
        className="mt-5 p-5"
      >
        <Title level={2}>Vendor Registration</Title>

        <Form.Item
          name="name"
          label="Vendor Name"
          rules={[{ required: true, message: "Vendor Name is required!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email is required!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="contact"
          label="Contact Number"
          rules={[{ required: true, message: "Contact Number is required!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="adress"
          label="Address"
          rules={[{ required: true, message: "Address is required!" }]}
        >
          <Input.TextArea showCount maxLength={100} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Register
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default VendorRegistrationForm;
