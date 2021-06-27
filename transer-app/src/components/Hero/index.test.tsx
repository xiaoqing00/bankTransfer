import React from 'react';
import { RenderResult, render } from '@testing-library/react';
import Hero from '.';

describe('Account Screen', () => {
    let component: RenderResult;
  
    beforeEach(() => {
      component = render(<Hero />);
    });
  
    it('has a title', () => {
        expect(component.getByText('ePay - A Secure Money Transfer System')).toBeInTheDocument();
      });
  
    it('has a sumary', () => {
      expect(component.getByText('ePay allows you to tranfser money in a secure way')).toBeInTheDocument();
    });
  
  });