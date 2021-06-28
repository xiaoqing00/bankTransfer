import React from 'react';
import { RenderResult, render } from '@testing-library/react';
import Login, { IUser } from '.';
import axios, { AxiosResponse } from 'axios';
import { act } from 'react-dom/test-utils';

jest.mock('axios');
 // Create an object of type of mocked Axios.
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Account Screen', () => {
    let component: RenderResult;
  const renderComponent = (user: IUser[])=>{
    axios.get = jest.fn().mockResolvedValue({
      data: user,
   status: 200,
    }as AxiosResponse<any>)
  }
    beforeEach(() => {
      component = render(<Login />);
      jest.restoreAllMocks();
    });
  
    it('has a top up', () => {
      expect(component.getByText('Welcome to ePay')).toBeInTheDocument();
    });

    it('fetches successfully data from an API', async () => {

      //Our desired output
      
 await act(async()=>{
  const todos: IUser[] = [
    {
     name: 'test',
     userID: 'test',
     status: 'active',
     mainbalance: 0,
     createDate: new Date()
    },
  ];
  renderComponent(todos);
 });
  //Prepare the response we want to get from axios
//   const mockedResponse: AxiosResponse = {
//    data: todos,
//    status: 200,
//    statusText: 'OK',
//    headers: {},
//    config: {},
//  };
 
expect(axios.get).toHaveBeenCalled();



 
   });
  
  });