import { Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import header from "../assets/img/header.png";

export default function Header() {
  return (
    <Navbar className="border-b-2">
       <Link to="/" className="self-center whitespace-nowrap w-20 md: ">
       <img src={header} alt="Header" />
       
       </Link>
    </Navbar>
  )
}
