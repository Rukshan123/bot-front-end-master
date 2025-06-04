import { Button, Input } from "antd";
import { FC } from "react";

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

  return (
    <div className="space-y-4">
      {formData.questions.map((qa, idx) => (
        <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            className="h-12"
            placeholder="Question"
            value={qa.question}
            onChange={(e) => handleChange(idx, "question", e.target.value)}
          />
          <Input
            className="h-12"
            placeholder="Answer"
            value={qa.answer}
            onChange={(e) => handleChange(idx, "answer", e.target.value)}
          />
        </div>
      ))}

      <div className="flex justify-between">
        <Button onClick={handleAdd}>Add Q / A</Button>
      </div>
    </div>
  );
};

export default QnAAgentForm;
