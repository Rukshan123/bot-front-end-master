import React, { useState } from "react";
import { Menu, Button, Avatar, Dropdown, Typography } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { menuProps } from "../../props/menuProps";
import { Link, useLocation } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

const { Title } = Typography;

const Navbar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const { instance, accounts } = useMsal();
  const user = accounts[0];

  console.log(user, "user");
  const userDisplayName = user?.name || user?.username || "Account";

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<ProfileOutlined />}>
        Profile
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="flex items-center justify-between px-8 py-4 shadow-sm h-24">
      {/* Left: Logo and Nav Links */}
      <div className="flex items-center gap-12">
        <Link to="/">
          <div className="flex items-center gap-2">
            <img
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              alt="Logo"
              className="w-20 h-20"
            />
            <Title level={3} style={{ margin: 0, paddingLeft: 8 }}>
              Saass ChatBot
            </Title>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-10 font-medium text-slate-700 pl-12 text-lg">
          {menuProps.map((item) => (
            <Link key={item.key} to={item.path}>
              <span
                className={`hover:text-blue-600 ${
                  currentPath === item.path
                    ? "text-blue-600 font-semibold underline"
                    : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Right: User Info */}
      <div className="flex items-center gap-4">
        <Dropdown overlay={userMenu} placement="bottomRight" arrow>
          <Button
            shape="round"
            icon={<Avatar icon={<UserOutlined />} size="small" />}
            className="pl-2 pr-3 flex items-center gap-2 text-base h-10"
          >
            {userDisplayName}
          </Button>
        </Dropdown>
      </div>
    </div>
  );
};

export default Navbar;
