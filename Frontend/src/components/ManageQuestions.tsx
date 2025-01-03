import React, { useState, useEffect } from "react";

interface Question {
  question: string;
  options: string[];
}

const ManageQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [newOptions, setNewOptions] = useState<string>("");

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch("http://localhost:3000/questions");
      const data = await response.json();
      setQuestions(data);
    };

    fetchQuestions();
  }, []);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const options = newOptions.split(",");
    await fetch("http://localhost:3000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: newQuestion, options }),
    });
    alert("Pergunta adicionada!");
    setNewQuestion("");
    setNewOptions("");
    const response = await fetch("http://localhost:3000/questions");
    setQuestions(await response.json());
  };

  const handleDeleteQuestion = async (index: number) => {
    await fetch(`http://localhost:3000/questions/${index}`, { method: "DELETE" });
    alert("Pergunta excluída!");
    const response = await fetch("http://localhost:3000/questions");
    setQuestions(await response.json());
  };

  return (
    <div>
      <h2>Gerenciar Perguntas</h2>
      <form onSubmit={handleAddQuestion}>
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Digite a pergunta"
          required
        />
        <textarea
          value={newOptions}
          onChange={(e) => setNewOptions(e.target.value)}
          placeholder="Digite as opções separadas por vírgula"
          required
        />
        <button type="submit">Adicionar Pergunta</button>
      </form>
      <ul>
        {questions.map((q, index) => (
          <li key={index}>
            <strong>{q.question}</strong>
            <ul>{q.options.map((option, i) => <li key={i}>{option}</li>)}</ul>
            <button onClick={() => handleDeleteQuestion(index)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageQuestions;
