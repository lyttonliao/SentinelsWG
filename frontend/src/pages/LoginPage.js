import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
    let { loginUser, errorMessages } = useContext(AuthContext)
    const [email, changeEmail] = useState('')
    const [password, changePassword] = useState('')

    return (
        <div className="position-absolute top-50 start-50 translate-middle col-10 col-lg-3">
            <div className="mb-4">
                <h2 className="ms-3">Welcome Back,</h2>
                <h3 className="text-end me-3">-Sentinels</h3>
            </div>
            {errorMessages.hasOwnProperty('detail') && 
                <small className="text-danger">{errorMessages.detail}</small>
            }
            <form onSubmit={loginUser}>
                <div className="mt-1 mb-4">
                    <label htmlFor="email-input" className="form-label">Email Address</label>
                    <input
                        type="email" 
                        className="form-control"
                        id="email-input"
                        onChange={(e) => changeEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password-input" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password-input"
                        onChange={(e) => changePassword(e.target.value)}
                        value={password}
                    />
                </div>
                <button type="submit" className="btn btn-primary float-end px-4">Sign In</button>
            </form>
        </div>
    );
};

export default LoginPage;
