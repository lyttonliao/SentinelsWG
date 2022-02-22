import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Navbar, Container, Nav, NavDropdown, NavLink, Button } from 'react-bootstrap'


function Header() {
    let { user, logoutUser } = useContext(AuthContext);
    
    console.log(user)
    return (
        <nav className="navbar ">
            <a className="navbar-brand mx-5" href="/">
                <img src="/images/sent.png" width="100" height="100" className="d-inline-block align-top" alt=""/>
            </a>
            {user ? (
                <div className="dropdown mx-5">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true">
                        {user.email}
                    </button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a className="dropdown-item" href="/" onClick={logoutUser}>Logout</a>
                    </div>
                </div>
            ) : (
                <a href="/login"><button className="btn btn-secondary mx-5">Sign In</button></a>
            )}
        </nav>
    )
};


export default Header;