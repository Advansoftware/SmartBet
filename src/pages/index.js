import { useEffect, useState } from "react";

export default function Home() {
  const [qrCode, setQrCode] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Função para buscar mensagens
  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/whatsappAuth?getMessages=true");
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    }
  };
  async function toggleResponseMode() {
    try {
      const res = await fetch('/api/whatsappAuth?toggleResponseMode=true');
      const data = await res.json();
      alert(data.message); // Exibe o novo modo de resposta
    } catch (error) {
      console.error('Erro ao alternar modo de resposta:', error);
    }
  }
  async function fetchQRCode() {
    try {
      const res = await fetch("/api/whatsappAuth");
      const data = await res.json();

      if (data.status === "authenticating") {
        setIsAuthenticating(true);
        setQrCode(null);
      } else if (data.status === "authenticated") {
        setIsAuthenticated(true);
        setIsAuthenticating(false);
      } else {
        setIsAuthenticating(false);
        if (data.qrCode) {
          setQrCode(data.qrCode);
        }
      }

      if (data.message) {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Erro ao carregar o QR Code:", error);
      setMessage("Erro ao iniciar o bot.");
      setIsAuthenticating(false);
    }
  }

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>WhatsApp Bot</h1>
      <button onClick={()=>fetchQRCode()}>Gerar qrcode</button>
      <button onClick={()=>fetchMessages()}>testar Mensagem</button>
      <button onClick={toggleResponseMode}>Alternar Modo de Resposta</button>
      {message && <p>{message}</p>}

      {!isAuthenticated ? (
        isAuthenticating ? (
          <div style={{ margin: "40px auto" }}>
            <h2>Autenticando...</h2>
            <div
              className="loading-spinner"
              style={{
                width: "50px",
                height: "50px",
                border: "5px solid #f3f3f3",
                borderTop: "5px solid #3498db",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "20px auto",
              }}
            />
            <style jsx>{`
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            `}</style>
          </div>
        ) : (
          qrCode && (
            <div>
              <h2>Escaneie o QR Code com o WhatsApp</h2>
              <img
                src={
                  qrCode.startsWith("data:")
                    ? qrCode
                    : `data:image/png;base64,${qrCode}`
                }
                alt="QR Code"
                style={{ margin: "20px auto", maxWidth: "300px" }}
              />
            </div>
          )
        )
      ) : (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2>Histórico de Mensagens</h2>
          <div style={{ textAlign: "left" }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  margin: "10px 0",
                  padding: "10px",
                  border: "1px solid #ccc",
                }}
              >
                <p>
                  <strong>Mensagem:</strong> {msg.message}
                </p>
                <p>
                  <strong>Resposta:</strong> {msg.response}
                </p>
                <small>{new Date(msg.timestamp).toLocaleString()}</small>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
