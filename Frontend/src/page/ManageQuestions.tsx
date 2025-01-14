import React, { useState, useEffect } from "react";
import "../style/ManageStyle.css";
import NavBar from "../components/NavBar";

interface Option {
  text: string;
  nextQuestionId?: number | null;
}

interface Question {
  id: number;
  question: string;
  options: Option[];
}

const ManageQuestions: React.FC = () => {
  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState<Option[]>([{ text: "" }]);

  // Carregar perguntas ao montar o componente
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:3000/questions");
        if (response.ok) {
          const data = await response.json();
          setQuestionsList(data);
        }
      } catch (err) {
        console.error("Erro ao carregar perguntas:", err);
      }
    };
    fetchQuestions();
  }, []);

  const handleOptionChange = (index: number, value: Partial<Option>) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index] = { ...updatedOptions[index], ...value };
    setNewOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setNewOptions([...newOptions, { text: "" }]);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = newOptions.filter((_, i) => i !== index);
    setNewOptions(updatedOptions);
  };

  const handleAddQuestion = async () => {
    if (newQuestion.trim() === "" || newOptions.some((opt) => opt.text.trim() === "")) {
      alert("Preencha a pergunta e todas as opções.");
      return;
    }
    const newQuestionData: Question = {
      id: questionsList.length + 1, // Geração simples de ID (ajuste conforme necessário)
      question: newQuestion,
      options: newOptions,
    };

    try {
      const response = await fetch("http://localhost:3000/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuestionData),
      });
      if (response.ok) {
        setQuestionsList([...questionsList, newQuestionData]);
        setNewQuestion("");
        setNewOptions([{ text: "" }]);
      } else {
        alert("Erro ao salvar a pergunta.");
      }
    } catch (err) {
      console.error("Erro ao salvar pergunta:", err);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/questions/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setQuestionsList(questionsList.filter((q) => q.id !== id));
      } else {
        alert("Erro ao deletar a pergunta.");
      }
    } catch (err) {
      console.error("Erro ao deletar pergunta:", err);
    }
  };

  return (
    <div className="ManageContainer">
      <NavBar title={"Gerenciador de Mensagens"} />
      <div className="ManageMain">
        <div className="ManageDiv1">
          <h2>Gerenciar Perguntas</h2>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              placeholder="Digite a pergunta"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="ManageInput"
            />
            {newOptions.map((option, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder={`Opção ${index + 1}`}
                  value={option.text}
                  onChange={(e) =>
                    handleOptionChange(index, { text: e.target.value })
                  }
                />
                <select
                  value={option.nextQuestionId || ""}
                  onChange={(e) =>
                    handleOptionChange(index, { nextQuestionId: +e.target.value || null })
                  }
                >
                  <option value="">Nenhuma</option>
                  {questionsList.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.question}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleRemoveOption(index)}>Excluir</button>
              </div>
            ))}
            <button onClick={handleAddOption} className="ManageAddButton">
              Adicionar Opção
            </button>
          </div>
          <button onClick={handleAddQuestion} className="ManageSubmitButton">
            Adicionar Pergunta
          </button>
        </div>
        <div className="ManageDiv1">
          <h2>Perguntas Criadas</h2>
          <ul>
            {questionsList.map((q) => (
              <li key={q.id}>
                <strong>{q.question}</strong>
                <ul>
                  {q.options.map((option, i) => (
                    <li key={i}>{option.text}</li>
                  ))}
                </ul>
                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="ManageDeleteButton"
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageQuestions;
