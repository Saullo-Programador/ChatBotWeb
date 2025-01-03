import React, { useState, useEffect } from "react";

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
    <div>
      <h2>Conectar ao WhatsApp</h2>
      {error && <p>{error}</p>}
      {qrCode ? (
        <img
          src={qrCode}
          alt="QR Code"
          style={{ width: "300px", height: "300px", margin: "auto", display: "block" }}
        />
      ) : (
        <p>Carregando QR code...</p>
      )}
    </div>
  );
};

export default ConnectWhatsApp;
