import React, { useState, useEffect } from "react";
import "../style/ManageStyle.css";
import NavBar from "../components/NavBar";

interface Question {
  question: string;
  options: string[];
}

const ManageQuestions: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>([""]);
  const [questionsList, setQuestionsList] = useState<Question[]>([]);

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

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  const handleAddQuestion = async () => {
    if (question.trim() === "" || options.some((opt) => opt.trim() === "")) {
      alert("Preencha a pergunta e todas as opções.");
      return;
    }

    const newQuestion: Question = { question, options };

    try {
      const response = await fetch("http://localhost:3000/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuestion),
      });
      if (response.ok) {
        setQuestionsList([...questionsList, newQuestion]);
        setQuestion("");
        setOptions([""]);
      } else {
        alert("Erro ao salvar a pergunta.");
      }
    } catch (err) {
      console.error("Erro ao salvar pergunta:", err);
    }
  };

  const handleDeleteQuestion = async (index: number) => {
    try {
      const response = await fetch(`http://localhost:3000/questions/${index}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setQuestionsList(questionsList.filter((_, i) => i !== index));
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
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="ManageInput"
            />
            {options.map((option, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <input
                  type="text"
                  placeholder={`Opção ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="ManageInput"
                />
                <button
                  onClick={() => handleRemoveOption(index)}
                  className="ManageRemoveButton"
                >
                  Excluir
                </button>
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
            {questionsList.map((q, index) => (
              <li key={index}>
                <strong>{q.question}</strong>
                <ul>
                  {q.options.map((option, i) => (
                    <li key={i}>{option}</li>
                  ))}
                </ul>
                <button
                  onClick={() => handleDeleteQuestion(index)}
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
