import React from 'react'
import { FaArrowLeft } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

interface navbar{
    title: string;
}
export default function NavBar( {title}:navbar ) {
  return (
    <div style={navBar}>
        <h1 style={tituloNavbar}>{title}</h1>
        <Link to={"/"} style={manageLink}>
            <FaArrowLeft color="#fff" />
        </Link>
    </div>
  )
}
const navBar: React.CSSProperties = {
    width: "100%",
    padding: "20px 0",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#002fff",
    color: "#fff",
    borderEndEndRadius: "20px",
    borderEndStartRadius: "20px",
};

const tituloNavbar: React.CSSProperties = {
    fontSize: "26px",
    fontWeight: "bold",
    margin: "0 15px",
};


const manageLink: React.CSSProperties = {
    width: "40px",
    height: "40px",
    margin: "0 15px",
    cursor: "pointer",
    background: "#252525",
    borderRadius: "50px",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
};