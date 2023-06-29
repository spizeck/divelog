import React, { useState } from 'react';
import api from '../utils/api';
import '../styles/Register.css';

const Register = ({ setShowRegisterForm }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            return;
        }

        try {
            // Send register request to the backend
            const registerResponse = await api.register(username, email, password);

            if (registerResponse.status === 201) {
                // Registration successful, show login form
                setShowRegisterForm(false);
            } else {
                // Other error
                setErrorMessage('An error occurred');
            }
        } catch (error) {
            setErrorMessage(error.message);
        }

    };

    return (
        <div className="register-container">

            <form className="register-form" onSubmit={handleRegister}>
                <h1>Please Register</h1>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit">Register</button>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </form>
        </div>
    );
};

export default Register;
