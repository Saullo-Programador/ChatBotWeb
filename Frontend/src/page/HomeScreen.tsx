import { Link } from "react-router-dom";
import '../style/HomeStyle.css'

export default function HomeScreen() {
  return (
    <div className="HomeContainer">
      <div className="HomeMain">
        <h1>Bem-vindo ao Chatbot do WhatsApp</h1>
        <div className="">
          <Link to="/Conectar" className="HomeLinks">
            <button className="HomeButton">Conectar ao WhatsApp</button>
          </Link>
        </div>
        <div className="">
          <Link to="/Mensagem" className="HomeLinks">
            <button className="HomeButton">Gerenciador de Mensagens</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
