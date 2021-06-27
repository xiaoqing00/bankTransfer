import React from 'react';
import { RenderResult, render } from '@testing-library/react';
import Login from '.';


describe('Account Screen', () => {
    let component: RenderResult;
  
    beforeEach(() => {
      component = render(<Login />);
    });
  
    it('has a top up', () => {
      expect(component.getByText('Welcome to ePay')).toBeInTheDocument();
    });
  
  });