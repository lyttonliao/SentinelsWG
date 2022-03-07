import React, { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
    let { registerUser } = useContext(AuthContext)
    const [email, changeEmail] = useState('')
    const [firstName, changeFirstName] = useState('')
    const [lastName, changeLastName] = useState('')

    return (
        <div className="position-absolute top-50 start-50 translate-middle col-10 col-lg-3">
            <h2 className="text-center mb-4">Registration</h2>
            <form onSubmit={registerUser}>
                <div className="mb-4">
                    <label htmlFor="email-input" className="form-label">Email Address</label>
                    <input
                        type="email" 
                        className="form-control"
                        id="email-input"
                        onChange={(e) => changeEmail(e.target.value)}
                        value={email}
                    />
                </div>
                <div className="d-inline-flex mb-4">
                    <div className="me-1">
                        <label htmlFor="first-name" className="form-label">First Name</label>
                        <input
                            type="text" 
                            className="form-control"
                            id="first-name"
                            onChange={(e) => changeFirstName(e.target.value)}
                            value={firstName}
                        />
                    </div>
                    <div classNamee="ms-1">
                        <label htmlFor="last-name" className="form-label">Last Name</label>
                        <input
                            type="email" 
                            className="form-control"
                            id="last-name"
                            onChange={(e) => changeLastName(e.target.value)}
                            value={lastName}
                        />
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="password-input-1" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password-input-1"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password-input-2" className="form-label">Re-enter your password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password-input-2"
                    />
                </div>
                <button type="submit" className="btn btn-primary float-end px-4">Sign Up</button>
            </form>
        </div>
    );
};

export default LoginPage;
