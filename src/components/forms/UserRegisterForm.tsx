// import React, { useState } from "react";
// import { Button, Form, Input, Col, Row, Typography } from "antd";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// const { Title } = Typography;

// function UserRegisterForm() {
//   const [data, setData] = useState({});

//   const location = useLocation();
//   const vendorData = location.state;
//   const navigate = useNavigate();

//   const onFinish = (userData: object) => {
//     setData({
//       vendorData: vendorData,
//       userData: userData,
//     });
//     navigate("/home", { state: "" });
//   };

//   console.error(data, "data");

//   return (
//     <Form
//       name="form_item_path"
//       layout="vertical"
//       style={{ maxWidth: 450 }}
//       onFinish={onFinish}
//     >
//       <Title level={2}>User Registration</Title>
//       <Form.Item
//         name="firstName"
//         label="First Name"
//         rules={[{ required: true, message: "First Name is required!" }]}
//       >
//         <Input />
//       </Form.Item>

//       <Form.Item
//         name="lastName"
//         label="Last Name"
//         rules={[{ required: true, message: "Last Name is required!" }]}
//       >
//         <Input />
//       </Form.Item>

//       <Form.Item
//         name="email"
//         label="Email"
//         rules={[{ required: true, message: "Email Name is required!" }]}
//       >
//         <Input />
//       </Form.Item>

//       <Form.Item
//         name="contact"
//         label="Contact Number"
//         rules={[{ required: true, message: "Conatct Number is required!" }]}
//       >
//         <Input />
//       </Form.Item>

//       <Form.Item
//         name="adress"
//         label="Adress"
//         rules={[{ required: true, message: "Adress is required!" }]}
//       >
//         <Input.TextArea showCount maxLength={100} />
//       </Form.Item>

//       <Form.Item
//         name="password"
//         label="Password"
//         rules={[
//           {
//             required: true,
//             message: "Please input your password!",
//           },
//         ]}
//         hasFeedback
//       >
//         <Input.Password />
//       </Form.Item>

//       <Form.Item
//         name="confirmPassword"
//         label="Confirm Password"
//         dependencies={["password"]}
//         hasFeedback
//         rules={[
//           {
//             required: true,
//             message: "Please confirm your password!",
//           },
//           ({ getFieldValue }) => ({
//             validator(_, value) {
//               if (!value || getFieldValue("password") === value) {
//                 return Promise.resolve();
//               }
//               return Promise.reject(
//                 new Error("The new password that you entered do not match!")
//               );
//             },
//           }),
//         ]}
//       >
//         <Input.Password />
//       </Form.Item>

//       <Row>
//         <Button block type="primary" htmlType="submit">
//           Sign Up
//         </Button>

//         <Col span={12}>
//           <div className="pt-4" />
//           Already have an account?{" "}
//           <Link className="underline pl-5" to="/">
//             Login!
//           </Link>
//         </Col>
//       </Row>
//     </Form>
//   );
// }

// export default UserRegisterForm;

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
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">Create your SaaSBot account</h1>
      <p className="mb-6 text-gray-600">
        Sign up using your Microsoft account:
      </p>
      <button
        onClick={handleSignup}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Sign Up with Microsoft
      </button>
    </div>
  );
};

export default RegisterPage;
