import { Button, Form, Input, Col, Row, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";

const { Title } = Typography;

function VendorRegistrationForm() {
  const navigate = useNavigate();
  const onFinish = (value: object) => {
    navigate("/register", { state: value });
  };

  return (
    <Form
      name="form_item_path"
      layout="vertical"
      style={{ maxWidth: 450 }}
      onFinish={onFinish}
    >
      <Title level={2}>Vendor Registration</Title>

      <Form.Item
        name="firstName"
        label="First Name"
        rules={[{ required: true, message: "First Name is required!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="lastName"
        label="Last Name"
        rules={[{ required: true, message: "Last Name is required!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: "Email Name is required!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="contact"
        label="Contact Number"
        rules={[{ required: true, message: "Conatct Number is required!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="adress"
        label="Adress"
        rules={[{ required: true, message: "Adress is required!" }]}
      >
        <Input.TextArea showCount maxLength={100} />
      </Form.Item>

      <Row>
        <Col span={12}>
          <div className="pt-4" />
          Already have an account?{" "}
          <Link className="underline pl-5" to="/">
            Login!
          </Link>
        </Col>

        <Col span={12} className="flex justify-end items-center">
          <Button size="middle" type="primary" htmlType="submit">
            Next
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default VendorRegistrationForm;
