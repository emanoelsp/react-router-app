import { Link } from "react-router-dom";

function Header(){
    return(
        <header className="bg-gray-900 text-white p-4">
            <nav className="flex justify-between">
                <h1 className="text-xl font-bold"> My APP </h1>
                <ul className="flex space-x-4">
                    <li><Link className="mr-4  
                hover:text-blue-800" to="/"> Início </Link></li>
                    <li> <Link className="mr-4 
                hover:text-blue-800" to="/sobre"> Sobre nós </Link></li>
                    <li> <Link className="mr-4
                hover:text-blue-800" to="/cadastro"> Cadastre-se </Link></li>
                  <li> <Link className="mr-4
                hover:text-blue-800" to="/usuarios"> Usuarios </Link></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header;