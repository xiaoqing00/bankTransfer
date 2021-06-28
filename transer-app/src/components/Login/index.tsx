import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Col, Row, Button } from 'sgds-govtech-react';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import './style.scss';
import { LoginContext, ScreenContext } from '../../context';
import Screen from '../../Screen';

export interface IUser {
  name: string;
  userID: string;
  status: string;
  mainbalance: number;
  createDate: Date;
}

const Login = () => {
  const history = useHistory();
  const { setScreen } = useContext(ScreenContext);
  const [username, setUsername] = useState('');
  const [nameIsEmpty, setNameIsEmpty] = useState(false);
  const {setUser} = useContext(LoginContext);

  const handleSubmit = async(event)=>{
  event.preventDefault();
  event.stopPropagation();
  setUsername(username?.trim().toLowerCase());

  try{
  var response= await axios.get("http://localhost:56785/api/users/"+username);
    if (response.status === 200 ) {
    // setUsername(response.data);
      setUser(response.data);
      history.push('/account');
    }
  }
  catch(err){
    console.log(err.message);
    if (err.message === "Request failed with status code 404")
    {
        console.log("creating new user");
        const newUser = {
          name: username,
          userID: username,
          status: 'active',
          mainbalance: 0,
          createDate: new Date()
        }
        await axios.post("http://localhost:56785/api/users/", newUser)
        .then(response => {
          console.log("new user created");
          alert("New user has been created, Please click login button");
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  };

  const handleOnChange =({target: {value}})=>{
    setUsername(value?.trim().toLowerCase());
  };

 return (
   <>
    <div className="sign-in-screen" data-testid="sign-in-screen">
    <div className="sign-in__section">
      <h3 className="sign-in__title">Welcome to ePay</h3>
     
      <Form
        noValidate 
        onSubmit={handleSubmit}
      >
        <Row>
            <Col is={4}>Enter your Name
            </Col>
            <Col is={4}>
                <input type="text" name="userName" onChange={handleOnChange}/>
            </Col>
          </Row>
          <Row>
            <Col is={8}>
              <Button isPrimary type="submit">
                LOG IN
              </Button>
            </Col>            
          </Row>
      </Form>
    </div>
  </div>
   </>
);
};
export default Login;