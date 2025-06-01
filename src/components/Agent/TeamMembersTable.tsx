import { Table, Button, Tag, Popconfirm } from "antd";

type Member = {
  key: string;
  name: string;
  email: string;
  role: string;
  status: string;
};

type Props = {
  members: Member[];
  onDelete: (key: string) => void;
};

const TeamMembersTable = ({ members, onDelete }: Props) => {
  const columns = [
    {
      title: "Member Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text: string) => (
        <Tag color={text === "Active" ? "green" : "orange"}>{text}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Member) => (
        <Popconfirm
          title="Are you sure you want to delete this member?"
          onConfirm={() => onDelete(record.key)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return <Table columns={columns} dataSource={members} pagination={false} />;
};

export default TeamMembersTable;
