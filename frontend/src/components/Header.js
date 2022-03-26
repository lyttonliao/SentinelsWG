import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';


function Header() {
    let { user, logoutUser } = useContext(AuthContext);
    
    return (
        <nav className="navbar lg:w-">
            <a className="navbar-brand mx-5" href="/">
                <img src="/images/sent.png" width="75" height="75" className="d-inline-block align-top" alt=""/>
            </a>
            <div>
                {user ? (
                    <div className="d-flex">
                        <p className="m-auto">{user.name}</p>
                        <a href="/" className="h-100 ms-3 me-5" onClick={logoutUser}>
                            <button className="btn btn-primary">Log Out</button>
                        </a>
                    </div>
                ) : (
                    <div className="d-flex">
                        <a className="ms-5 me-2 h-100" href="/login"><button className="btn btn-primary">Sign In</button></a>
                        <a className="ms-2 me-5 h-100" href="/register"><button className="btn btn-primary">Sign Up</button></a>
                    </div>
                )}
            </div>
        </nav>
    )
};


export default Header;