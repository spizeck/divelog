import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import api from '../utils/api';
import '../styles/Login.css';

const ForgotPassword = ({ setShowForgotPassword }) => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

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
                setSuccessMessage(forgotPasswordResponse.message);
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                // Other error
                setErrorMessage('An error occurred');
            }
        } catch (error) {
            setErrorMessage(error.message);

        }
    };

    return (
        <div className="login-container">
            <Form className="login-form" onSubmit={handleForgotPassword}>
                <h1>Forgot Password</h1>
                <Form.Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button fluid type="submit" primary>Reset Password</Button>  
                <p></p>
                <Button fluid type='button' onClick={() => {
                    navigate('/login');
                }}>Back</Button>
                {successMessage && <Message positive>{successMessage}</Message>}
                {errorMessage && <Message negative>{errorMessage}</Message>}
            </Form>
        </div>
    );
};

export default ForgotPassword;