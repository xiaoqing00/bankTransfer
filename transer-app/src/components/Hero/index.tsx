import React from 'react';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import './style.scss';

const Hero = () => {
  return (
    <Jumbotron fluid className="hero" data-testid="hero">
      <Container className="hero__content">
        <h1 className="hero__title">ePay - A Secure Money Transfer System</h1>
        <p className="hero__summary">ePay allows you to tranfser money in a secure way</p>
      </Container>
    </Jumbotron>
  );
};

export default Hero;