import React from "react";
import { Divider, Typography, Card, Flex } from "antd";
import { Link } from "react-router-dom";

const { Text } = Typography;

const cardStyle: React.CSSProperties = {
  width: 620,
  border: "none",
};

const imgStyle: React.CSSProperties = {
  display: "block",
  width: 100,
  height: 100,
};

function GettingStartingTopBar() {
  return (
    <div>
      {" "}
      <Card
        style={cardStyle}
        styles={{ body: { padding: 0, overflow: "hidden" } }}
      >
        <Flex justify="flex-start">
          <Link className="underline pl-5 " to="/">
            <img
              alt="avatar"
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              style={imgStyle}
            />
          </Link>

          <Flex
            vertical
            align="flex-start"
            justify="flex-start"
            style={{ padding: 32 }}
          >
            <Typography.Title level={3}>Get Started!</Typography.Title>
            <Text className="text-base">Welcome to ChatBot</Text>
          </Flex>
        </Flex>
      </Card>
      <Divider />
    </div>
  );
}

export default GettingStartingTopBar;
