import React from 'react';
import { RenderResult, render } from '@testing-library/react';
import AccountScreen from '.';

describe('Account Screen', () => {
    let component: RenderResult;
  
    beforeEach(() => {
      component = render(<AccountScreen />);
    });
  
    it('has a top up', () => {
      expect(component.getAllByText('Top Up')).toBeInTheDocument();
    });
  
  });