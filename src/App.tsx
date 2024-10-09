import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import "./App.css";

import ITransactions from "./types/Transactions";
import IEmployee from "./types/Employee";
import ReceiveDataService from "./services/ReceiveDataService";

import { Header } from "./components/Header/Header";
import { Transactions } from "./components/Transactions/Transactions";

const App: React.FC = () => {

  const [transactionsData, setGetTransactionsData] = useState<ITransactions | null>(null);

  const employees: IEmployee[] = useMemo( () => [], []);
  const [employeeWinner, setEmployeeWinner] = useState<IEmployee>();
  const [loadingError, setLoadingError] = useState<string| null>(null);

  const verifyEmployeeWinner = () => {
    const winnerAmmount = Math.max.apply(
      null,
      employees.map(
        emp => { return emp.amount }
      )
    );
    const index = employees.findIndex( emp => emp.amount === winnerAmmount);
    setEmployeeWinner(employees[index]);
  };

  const fetchEmployeesData = (data: ITransactions) => {
    const currentYear = (new Date()).getFullYear();
    data.transactions.map(transaction => {
      const transactionDate = (new Date(transaction.timeStamp)).getFullYear();
      const index = employees.findIndex( emp => emp.id === transaction.employee.id);
      if (currentYear - 1 === transactionDate) {
        if ( index < 0 ) {
          transaction.type === "alpha" ?
          employees.push({
            name: transaction.employee.name,
            id: transaction.employee.id,
            transactions:[transaction.transactionID],
            amount: transaction.amount,
          }) : 
          employees.push({
            name: transaction.employee.name,
            id: transaction.employee.id,
            transactions:[],
            amount: transaction.amount,
          })
        } else {
          employees[index].amount = employees[index].amount + transaction.amount;
          transaction.type === "alpha" && employees[index].transactions.push(transaction.transactionID);
        }
      }
      return transaction;
    });
  };
  
  const { isLoading: isLoadingTransactions, refetch: getAllTransactions } = useQuery<ITransactions, Error>(
    "query-tutorials",
    async () => {
      return await ReceiveDataService.getTransactionsData();
    },
    {
      enabled: false,
      onSuccess: (res) => {
        setGetTransactionsData(res);
      },
      onError: (err: any) => {
        setGetTransactionsData(err.response?.data || err);
      },
    }
  );
  useEffect(() => {
    if (transactionsData) {
      fetchEmployeesData(transactionsData);
    }
  }, [isLoadingTransactions, transactionsData]);

  useEffect(() => {
    if(employees.length > 0) verifyEmployeeWinner();
  }, [employees, verifyEmployeeWinner]);

  const getAllData = () => {
    try {
      getAllTransactions();
    } catch (err) {
      setLoadingError("Error loading data. Please try to reload the page.");
    }
  }

  useEffect(
    () => {
      getAllData();
    }, []);

  return (
    <div id="app" className="container my-3">
      <Header/>
      <div className="body">
        <div className="main">
          { employeeWinner ? (
            <div className="alert alert-secondary mt-2" role="alert">
              <Transactions employee={employeeWinner!} transactionId={transactionsData!.id} />
            </div>
          ) : (
            <div className="alert alert-secondary mt-2" role="alert">
              <pre>... Is loading</pre>
            </div>
          )}
          { loadingError &&
            (<pre>{loadingError}</pre>)
          }
        </div>
      </div>
    </div>
  );
}

export default App;
