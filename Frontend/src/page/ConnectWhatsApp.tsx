import React, { useState, useEffect } from "react";
import '../style/ConnectStyle.css'
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";

const ConnectWhatsApp: React.FC = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await fetch("http://localhost:3000/qr");
        if (response.ok) {
          const { qrCode } = await response.json();
          setQrCode(qrCode);
        } else {
          setError("QR code ainda não disponível. Aguarde...");
        }
      } catch {
        setError("Erro ao carregar o QR code. Tente novamente.");
      }
    };

    fetchQRCode();
  }, []);

  return (
    <div className="ConnectContainer">
      <NavBar title="Conectar ao WhatsApp" />
      <div className="ConnectMain">
        <h2>Conectar ao WhatsApp</h2>
        {error && <p>{error}</p>}
        {qrCode ? (
          <>
            <img
              src={qrCode}
              alt="QR Code"
              style={{ width: "300px", height: "300px", margin: "auto", display: "block" }}
            />
            <Link to={"/"}  className="HomeLinks">
              <button className="ConnectButton" style={{color: "#00a70e", borderColor:"#00a70e" }}>
                Conectou
              </button>
            </Link>
            <Link to={"/Conectar"} className="HomeLinks">
              <button className="ConnectButton" style={{color: "#a70000", borderColor: "#a70000"}}>
                Não Conectou
              </button>
            </Link>
          </>
        ) : (
          <p>Carregando QR code...</p>
        )}
      </div>
    </div>
  );
};

export default ConnectWhatsApp;
