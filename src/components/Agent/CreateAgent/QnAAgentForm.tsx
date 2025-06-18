import { Button, Input } from "antd";
import { FC } from "react";
import { DeleteOutlined } from "@ant-design/icons";

interface QnAFormData {
    questions: Array<{
        question: string;
        answer: string;
    }>;
}

interface Props {
    formData: QnAFormData;
    onChange: (data: QnAFormData) => void;
}

const QnAAgentForm: FC<Props> = ({ formData, onChange }) => {
    console.log(formData, "qa form data");

    const handleChange = (
        index: number,
        field: "question" | "answer",
        value: string
    ) => {
        const updated = [...formData.questions];
        updated[index][field] = value;
        onChange({ questions: updated });
    };

    const handleAdd = () => {
        onChange({
            questions: [...formData.questions, { question: "", answer: "" }],
        });
    };

    const handleDelete = (index: number) => {
        const updated = formData.questions.filter((_, idx) => idx !== index);
        onChange({ questions: updated });
    };

    return (
        <div className="space-y-4">
            {formData.questions.map(
                (qa, idx) => (
                    console.log(qa, "qa"),
                    (
                        <div
                            key={idx}
                            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-center"
                        >
                            <Input
                                className="h-12"
                                placeholder="Question"
                                value={qa.question}
                                onChange={(e) =>
                                    handleChange(
                                        idx,
                                        "question",
                                        e.target.value
                                    )
                                }
                            />
                            <Input
                                className="h-12"
                                placeholder="Answer"
                                value={qa.answer}
                                onChange={(e) =>
                                    handleChange(idx, "answer", e.target.value)
                                }
                            />
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(idx)}
                            />
                        </div>
                    )
                )
            )}

            <div className="flex justify-between">
                <Button onClick={handleAdd}>Add Q / A</Button>
            </div>
        </div>
    );
};

export default QnAAgentForm;
