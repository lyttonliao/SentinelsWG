import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';


function Header() {
    let { user, logoutUser } = useContext(AuthContext);
    
    return (
        <nav className="navbar d-flex border border-light border-2">
            <a className="navbar-brand d-flex justify-content-center w-50 me-0 border-end border-light border-2" href="/">
                <img src="/images/sent.png" width="85" height="85" className="d-inline-block align-top" alt="" />
            </a>
            {user ? (
                <div className="w-50 h-100">
                    <div className="nav-button border-bottom border-light border-2">{user.name}</div>
                    <div className="nav-button trigger" onClick={logoutUser}>Log Out</div>
                </div>
            ) : (
                <div className="d-block w-50 h-100">
                    <a className="text-decoration-none " href="/login">
                        <div className="nav-button trigger border-bottom border-light border-2">Sign In</div>
                    </a>
                    <a className="text-decoration-none " href="/register">
                        <div className="nav-button trigger">Sign Up</div>
                    </a>
                </div>
            )}
        </nav>
    )
};


export default Header;