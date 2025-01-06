import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import '../style/ManageStyle.css'

interface Question {
  question: string;
  options: string[];
}

const ManageQuestions: React.FC = () => {
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>([""]);
  const [questionsList, setQuestionsList] = useState<Question[]>([]);

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

  const handleAddQuestion = () => {
    if (question.trim() === "" || options.some((opt) => opt.trim() === "")) {
      alert("Preencha a pergunta e todas as opções.");
      return;
    }

    const newQuestion: Question = { question, options };
    setQuestionsList([...questionsList, newQuestion]);
    setQuestion("");
    setOptions([""]);
  };

  return (
    <div className="ManageContainer">
      <div className="ManageMain">
        <div className="ManageHeader">
          <h2>Gerenciar Perguntas</h2>
          <Link to={"/"} className="ManageLink">
            <FaArrowLeft color="#fff" />
          </Link>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Digite a pergunta"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="ManageInput"
          />
          {options.map((option, index) => (
            <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <input
                type="text"
                placeholder={`Opção ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="ManageInput"
              />
              <button onClick={() => handleRemoveOption(index)} className="ManageRemoveButton">
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
        <h3 style={{ marginTop: "20px" }}>Perguntas Criadas</h3>
        <ul>
          {questionsList.map((q, index) => (
            <li key={index}>
              <strong>{q.question}</strong>
              <ul>
                {q.options.map((option, i) => (
                  <li key={i}>{option}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default ManageQuestions;
