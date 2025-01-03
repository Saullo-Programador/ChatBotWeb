import React, { useState } from "react";
import ConnectWhatsApp from "./components/ConnectWhatsApp";
import ManageQuestions from "./components/ManageQuestions";
import "./style/styles.css";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"connect" | "manage">("connect");

  return (
    <div className="main">
      <div className="container">
        <h1>Chatbot Manager</h1>
        <div id="tabs">
          <button onClick={() => setActiveTab("connect")}>Conectar WhatsApp</button>
          <button onClick={() => setActiveTab("manage")}>Gerenciar Perguntas</button>
        </div>
        <div id="content">
          {activeTab === "connect" && <ConnectWhatsApp />}
          {activeTab === "manage" && <ManageQuestions />}
        </div>
      </div>
    </div>
  );
};

export default App;
