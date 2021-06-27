import React, { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../context';
import { Col, Row, Button } from 'sgds-govtech-react';
import { Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './style.scss';
import { IAccount } from '../AccountScreen';
import TransactionComponent from '../TransactionSegment';

const TransferScreen = () => {

    const {user} = useContext(LoginContext);
    const [transfer, setTransfer] = useState('');
    const [toAcc, setToAcc] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [toAccExist, setToAccExist] = useState(true);
    const {setUser} = useContext(LoginContext);
    const [account, setAccount] = useState<IAccount[]>([]);

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

    const handleOnChange =({target: {value}})=>{
        setTransfer(value?.trim());
      };
      const handleOnChangeName =({target: {value}})=>{
        setToAcc(value?.trim());
      };

      const handleSubmit = async(event)=>{
        event.preventDefault();
        event.stopPropagation();
        setTransfer(transfer?.trim());
        setToAcc(toAcc?.trim());

        const newTransaction = {
            transactionID: Math.floor(Math.random() * 1000000000),
            type: 'transfer',
            fromUserID: user?.userID,
            toAccID: toAcc,
            amout: transfer,
            createDate: new Date(),
            status: ''
          }
          //check toacc exist?
          try{
            var response= await axios.get("http://localhost:56785/api/users/"+toAcc);
              if (response.status === 200 ) {
                try{
                    await axios.post(`http://localhost:56785/api/transactions`, newTransaction
                    )
                    .then(response => {
                      console.log("transfer");
                    })
                    .catch(error => {
                      console.log(error);
                    });
                  }
                  catch(err){
                    console.log(err.message);
                  }
              }
            } catch(err){
                console.log(err.message);
                console.log("not exist");
                setToAccExist(false);
            }

          setRefreshKey(o=> o+1);
      }
    return(
        <>        
        <div className="transfer-screen" >
        <div className="transfer__section">
        <p>Transfer</p>
         <Row>
               <Col is={4}>  <h3 className="transfer__title">Hello {user?.userID}!</h3>
               </Col>      
         </Row>
         <Row>
               <Col is={4}>  <p className="transfer__title">Your Balance is {user?.mainbalance}
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
         <Form
        noValidate 
        onSubmit={handleSubmit}
      >
        <Row>
            <Col is={6}>Transfer To
            </Col>
            <Col is={6}>
                <input type="text" name="toAcc" onChange={handleOnChangeName}/> 
                { !toAccExist && <div className="transfer__p"><p>Not Exist</p></div>}
            </Col>
        </Row>
        <Row>
            <Col is={6}>Transfer Amout
            </Col>
            <Col is={6}>
                <input type="text" name="transfer" onChange={handleOnChange}/>
            </Col>
        </Row>
        <Row>
            <Col is={8}>
              <Button isPrimary type="submit">
                Transfer
              </Button>
            </Col>            
        </Row>
        <Row>
            <Col is={8}>
            <Link to="/account">Top Up</Link>
            </Col>            
        </Row>
      </Form>
      <TransactionComponent />
         </div>
         </div>
         </>
    );
}

export default TransferScreen;