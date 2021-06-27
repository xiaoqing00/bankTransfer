
import React, { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../../context';
import { Col, Row, Button } from 'sgds-govtech-react';
import TransferScreen from '../TransferScreen';
import axios from 'axios';

export interface ITransaction {
  transactionID: string,
  type: string,
  fromUserID: string,
  toAccID: string,
  amout: DoubleRange,
  createDate: Date,
  status: string
}

const TransactionComponent = () =>{
  const {user} = useContext(LoginContext);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);


  const fetchData = async () => {
    const transactions = await axios.get(`http://localhost:56785/api/transactions/${user?.userID}`
           );
    if (transactions.status === 200 ) {
      setTransactions(transactions.data);
      console.log(transactions.data);
    }
  }
  useEffect(() => { 
    fetchData();
    }, []);
  return (
<ul className="transactions">
          {transactions && transactions.map((a) => (
            <li key={a.transactionID}>
              <p>{a.fromUserID} {a.type} {a.amout} to {a.toAccID}</p>
            </li>
          ))}
        </ul>
  );
};

export default TransactionComponent;