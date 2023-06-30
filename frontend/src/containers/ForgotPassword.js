import React, { useState } from 'react';
import api from '../utils/api';
import '../styles/ForgotPassword.css';

const ForgotPassword = ({ setShowForgotPassword }) => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (email === '') {
            setErrorMessage("Please enter your email");
            return;
        }

        try {
            const forgotPasswordResponse = await api.forgotPassword(email);

            if (forgotPasswordResponse.status === 200) {
                // Password reset email sent
                setShowForgotPassword(false);
            } else {
                // Other error
                setErrorMessage('An error occurred');
            }
        } catch (error) {
            setErrorMessage(error.message);

        }
    };

    return (
        <div className="forgot-password-container">
            <form className="forgot-password-form" onSubmit={handleForgotPassword}>
                <h1>Forgot Password</h1>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Reset Password</button>  
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </form>
        </div>
    );
};

export default ForgotPassword;