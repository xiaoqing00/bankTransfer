import React from 'react';
import { RenderResult, render } from '@testing-library/react';
import Header from '.';

describe('Account Screen', () => {
    let component: RenderResult;
  
    beforeEach(() => {
      component = render(<Header />);
    });
  
    it('has a title', () => {
        expect(component.getByText('Bank of ABC')).toBeInTheDocument();
      });
  
  });