import { Table, Button, Tag, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";

type Member = {
    key: string;
    name: string;
    email: string;
    roles: string[];
    status: string;
};

type Props = {
    members: Member[];
    onDelete: (key: string) => void;
};

const TeamMembersTable = ({ members, onDelete }: Props) => {
    const columns: ColumnsType<Member> = [
        {
            title: "Member Name",
            dataIndex: "name",
            key: "name",
            responsive: ["xs"],
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            responsive: ["sm"],
        },
        {
            title: "Role",
            dataIndex: "roles",
            key: "roles",
            responsive: ["md"],
            render: (roles: string[]) => (
                <>
                    {roles.map((role) => (
                        <Tag key={role}>{role.toUpperCase()}</Tag>
                    ))}
                </>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (text: string) => (
                <Tag color={text === "ACTIVE" ? "green" : "orange"}>{text}</Tag>
            ),
            responsive: ["sm"],
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
            responsive: ["xs"],
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={members}
            pagination={false}
            scroll={{ x: true }}
            className="overflow-x-auto"
        />
    );
};

export default TeamMembersTable;
