import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
    let { registerUser } = useContext(AuthContext)
    return (
        <div>
            <form onSubmit={registerUser}>
                <input type="text" name="email" placeholder="PLEASE ENTER AN EMAIL ADDRESS" />
                <input type="password" name="password1" placeholder="PASSWORD REQUIRED" />
                <input type="password" name="password2" placeholder="PASSWORD REQUIRED" />
                <input type="text" name="first_name" placeholder="First Name" />
                <input type="text" name="last_name" placeholder="Last Name" />
                <input type="submit" />
            </form>
        </div>
    );
};

export default LoginPage;
