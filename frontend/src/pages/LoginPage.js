import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
    let { loginUser } = useContext(AuthContext)
    return (
        <div>
            <form onSubmit={loginUser}>
                <input type="text" name="email" placeholder="PLEASE ENTER AN EMAIL ADDRESS" />
                <input type="password" name="password" placeholder="PASSWORD REQUIRED" />
                <input type="submit" />
            </form>
        </div>
    );
};

export default LoginPage;
