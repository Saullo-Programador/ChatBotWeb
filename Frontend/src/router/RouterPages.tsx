import { Routes, Route,} from "react-router-dom";
import { Fragment } from "react";
import ConnectWhatsApp from "../page/ConnectWhatsApp";
import ManageQuestions from "../page/ManageQuestions";
import HomeScreen from "../page/HomeScreen";

const RouterPages: React.FC = () =>{
  return (
    <Fragment>
        <Routes>
          <Route path="/" element={<HomeScreen/>} />
          <Route path="/Conectar" element={<ConnectWhatsApp/>} />
          <Route path="/Mensagem" element={<ManageQuestions/>}/>
        </Routes>
    </Fragment>
  )
}

export default RouterPages