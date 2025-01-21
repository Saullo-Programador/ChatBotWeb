import React, { useState, useEffect } from "react";
import "../style/ManageStyle.css";
import NavBar from "../components/NavBar";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";

interface SubQuestion {
  id: number;
  question: string;
}

interface Option {
  text: string;
  nextQuestionId?: number | null;
  subQuestions?: SubQuestion[];
}

interface Question {
  id: number;
  question: string;
  options: Option[];
}

interface QuestionCardProps {
  question: Question;
  questionsList: Question[];
}

const ManageQuestions: React.FC = () => {
  const [questionsList, setQuestionsList] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState<Option[]>([{ text: "", subQuestions: [] }]);

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
    setNewOptions([...newOptions, { text: "", subQuestions: [] }]);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = newOptions.filter((_, i) => i !== index);
    setNewOptions(updatedOptions);
  };

  const handleAddSubQuestion = (optionIndex: number) => {
    const updatedOptions = [...newOptions];
    const subQuestions = updatedOptions[optionIndex].subQuestions || [];
    subQuestions.push({ id: subQuestions.length + 1, question: "" });
    updatedOptions[optionIndex].subQuestions = subQuestions;
    setNewOptions(updatedOptions);
  };

  const handleSubQuestionChange = (
    optionIndex: number,
    subIndex: number,
    value: string
  ) => {
    const updatedOptions = [...newOptions];
    if (updatedOptions[optionIndex].subQuestions) {
      updatedOptions[optionIndex].subQuestions[subIndex].question = value;
    }
    setNewOptions(updatedOptions);
  };

  const handleAddQuestion = async () => {
    if (newQuestion.trim() === "" || newOptions.some((opt) => opt.text.trim() === "")) {
      alert("Preencha a pergunta e todas as opções.");
      return;
    }
    const newQuestionData: Question = {
      id: questionsList.length + 1,
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
        setNewOptions([{ text: "", subQuestions: [] }]);
      } else {
        alert("Erro ao salvar a pergunta.");
      }
    } catch (err) {
      console.error("Erro ao salvar pergunta:", err);
    }
  };

  const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionsList }) => {
    const [isExpanded, setIsExpanded] = useState(false);
  
    const toggleExpand = () => {
      setIsExpanded(!isExpanded);
    };
  
    const getNextQuestion = (nextQuestionId: number | null | undefined) => {
      if (nextQuestionId === null || nextQuestionId === undefined) {
        return null;
      }
      return questionsList.find((q) => q.id === nextQuestionId);
    };
  
    return (
      <div className="question-card">
        {/* Pergunta principal */}
        <div className="question-header" onClick={toggleExpand}>
          {question.question}
          {isExpanded ? <FaAngleUp /> : <FaAngleDown />}
        </div>
  
        {/* Opções e subperguntas */}
        {isExpanded && (
          <div className="question-body">
            <ul>
              {question.options.map((option, index) => (
                <li key={index}>
                  <strong>Opção:</strong> {option.text}
                  {/* Verifique se nextQuestionId existe */}
                  {option.nextQuestionId !== null && option.nextQuestionId !== undefined && (
                    <div className="sub-question">
                      <strong>Próxima pergunta:</strong>{" "}
                      {getNextQuestion(option.nextQuestionId)?.question || "Não encontrada"}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
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
              <div key={index} style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", alignItems: "center"}}>
                  <input
                    type="text"
                    placeholder={`Opção ${index + 1}`}
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(index, { text: e.target.value })
                    }
                    style={{marginRight:"5px"}}
                  />
                  <button onClick={() => handleAddSubQuestion(index)} style={{marginRight:"5px"}}>+ Subpergunta</button>
                  <button onClick={() => handleRemoveOption(index)} className="ManageRemoveButton">Excluir</button>
                </div>
                {option.subQuestions &&
                  option.subQuestions.map((sub, subIndex) => (
                    <div key={subIndex} style={{ marginLeft: "20px" }}>
                      <input
                        type="text"
                        placeholder={`Subpergunta ${subIndex + 1}`}
                        value={sub.question}
                        onChange={(e) =>
                          handleSubQuestionChange(index, subIndex, e.target.value)
                        }
                      />
                    </div>
                  ))}
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
          <div className="manage-questions">
            {questionsList.map((question) => (
              <QuestionCard key={question.id} question={question} questionsList={questionsList} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageQuestions;
