import React from 'react';
import './style.scss';
import { Section, Container, Row, Col } from "sgds-govtech-react";

const Header = () => (
  <>
    <Section className="header__logos">
      <Container>
        <Row>
          <Col>
            Bank of ABC            
          </Col>
        </Row>
      </Container>
    </Section>
  </>);
export default Header;