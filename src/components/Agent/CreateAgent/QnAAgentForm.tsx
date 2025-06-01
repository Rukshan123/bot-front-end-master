import { Button, Input } from "antd";
import { useState } from "react";

const QnAAgentForm = () => {
  const [questions, setQuestions] = useState([{ question: "", answer: "" }]);

  const handleChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const handleAdd = () => {
    setQuestions([...questions, { question: "", answer: "" }]);
  };

  return (
    <div className="space-y-4">
      {questions.map((qa, idx) => (
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
