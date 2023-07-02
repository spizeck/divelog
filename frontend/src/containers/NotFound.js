// Make a 404 page that will redirect to the home page after 3 seconds
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Header } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const NotFound = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        setTimeout(() => {
        navigate('/home');
        }, 3000);
    }, [navigate]);
    
    return (
        <Container className='not-found-container'>
        <Header as='h1'>404</Header>
        <p>Page not found. Redirecting to home page...</p>
        </Container>
    );
    }

export default NotFound;

