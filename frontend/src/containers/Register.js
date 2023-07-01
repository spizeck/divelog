import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Form, Button, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import '../styles/Login.css';

const Register = ({ setShowRegisterForm, setShowLoginForm }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();

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
                setSuccessMessage(registerResponse.message)
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                // Server error or Validation error
                const errorMessage = Array.isArray(registerResponse.data.message)
                    ? registerResponse.data.message
                    : [registerResponse.data.message];
                setErrorMessage(errorMessage);
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = Array.isArray(error.response.data.message)
                    ? error.response.data.message
                    : [error.response.data.message];
                setErrorMessage(errorMessage);
            } else {
                setErrorMessage([error.message]);
            }
        }

    };

    return (
        <div className="login-container">

            <Form onSubmit={handleRegister} className='login-form'>
                <h1>Please Register</h1>
                <Form.Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Form.Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Form.Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Form.Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button type="submit" primary>Register</Button>
                <p></p>
                <Button type="button" onClick={() => {
                    navigate('/login');
                }}>Back</Button>
                {successMessage && <Message positive>{successMessage}</Message>}
                {errorMessage && <Message negative>{errorMessage.map((error, index) => <p key={index}>{error}</p>)}</Message>}
            </Form>
        </div>
    );
};

export default Register;
