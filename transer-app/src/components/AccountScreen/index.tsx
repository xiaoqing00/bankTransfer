import React, { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../context';
import { Col, Row, Button } from 'sgds-govtech-react';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import './style.scss';
import { Link } from 'react-router-dom';
import { IUser } from '../Login';
import TransactionComponent from '../TransactionSegment';

export interface IAccount {
  userID: string;
  accountID: string;
  accountName: string;
  balance: DoubleRange;
  status: string;
  createDate: Date;  
}

const AccountScreen = () => {
 const {user} = useContext(LoginContext);
const [topup, setTopUp] = useState('');
const [account, setAccount] = useState<IAccount[]>([]);
const [refreshKey, setRefreshKey] = useState(0);
const {setUser} = useContext(LoginContext);

const handleOnChange =({target: {value}})=>{
  setTopUp(value?.trim());
};

const fetchData = async () => {
  const userUpdate = await axios.get(`http://localhost:56785/api/users/${user?.userID}`
         );
  if (userUpdate.status === 200 ) {
    setUser(userUpdate.data);
    console.log(userUpdate.data);
  }
  const response = await axios.get(`http://localhost:56785/api/accounts`,{
          headers: {
            'Content-Type': 'application/json',
          }
        });
  if (response.status === 200 ) {
    setAccount(response.data);
  }
}

useEffect(() => { 
  fetchData();
  }, [refreshKey]);

const handleSubmit = async(event)=>{
  event.preventDefault();
  event.stopPropagation();
  setTopUp(topup?.trim());

  const newTransaction = {
    transactionID: Math.floor(Math.random() * 1000000000),
    type: 'topup',
    fromUserID: user?.userID,
    toAccID: user?.userID,
    amout: topup,
    createDate: new Date(),
    status: ''
  }

  try{
    await axios.post(`http://localhost:56785/api/transactions`, newTransaction
    )
    .then(response => {
      console.log("top up");
    })
    .catch(error => {
      console.log(error);
    });
  }
  catch(err){
    console.log(err.message);
  }
  setRefreshKey(o=> o+1);
  };

 return (
  <div className="account-screen" >
     <div className="account__section">
      <Row>
            <Col is={4}>  <h3 className="account__title">Hello {user?.userID}!</h3>
            </Col>      
      </Row>
      <Row>
            <Col is={4}>  <p className="account__title">Your Balance is {user?.mainbalance}
          </p>
            </Col>      
      </Row> 
      <ul className="accounts">
          {account && account.map((a) => (
            <li key={a.accountID}>
              <p>{a.userID} {a.balance} to {a.accountID}</p>
            </li>
          ))}
        </ul>
        <TransactionComponent />
      <Form
        noValidate 
        onSubmit={handleSubmit}
      >
        <Row>
            <Col is={4}>Top Up
            </Col>
            <Col is={4}>
                <input type="text" name="topup" onChange={handleOnChange}/>
            </Col>
        </Row>
        <Row>
            <Col is={8}>
              <Button isPrimary type="submit">
                Top Up
              </Button>
            </Col>            
        </Row>
        <Row>
            <Col is={8}>
            <Link to="/transfer">Transfer</Link>
            </Col>            
        </Row>
      </Form>
     </div>
</div>
 )};
 

  export default  AccountScreen;