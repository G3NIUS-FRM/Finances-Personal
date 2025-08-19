import React from "react";
import { useState,useEffect } from "react";
import TransactionModal from "./TransactionModal";

const TransactionsTable = ({transactions, setTransactions}) => {
  
    const [categories, setCategories] = useState([])
    const [editId, setEditId] =useState(-1)
    const [showModal, setShowModal] = useState(false)
    const [showMenu, setShowMenu] =useState(false)
    const [menuPosition, setMenuPosition] = useState ({x:0, y:0, id:-1})
    const token = JSON.parse(localStorage.getItem('token'))
    const [date, setDate] = useState({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear()
    });
    


    const handleMenuClick = (e, id) =>{
       e.preventDefault()
       setShowMenu(!showMenu)
       setMenuPosition({x:e.clientX, y:e.clientY, id:id})
    }
    const handleDateBack = () => {
      setDate(prev => {
        let { month, year } = prev;
        if (month === 1) {
          year -= 1;
          month = 12;
        } else {
          month -= 1;
        }
        return { month, year };
      });

    };
    
    
    const handleDateForward = () => {
      setDate(prev => {
        let { month, year } = prev;
        if (month === 12) {
          year += 1;
          month = 1;
        } else {
          month += 1;
        }
        return { month, year };
      });

    };
    
    const clasifyTransactions = (transactions, categories) => {
      let runningBalance = 0;
      return [...transactions]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(transaction => {
          const category_found = categories.find(c => c.id === transaction.category) || {};
          const amount = category_found.type === "expense" 
            ? -Math.abs(transaction.amount) 
            : Math.abs(transaction.amount);
    
          runningBalance += amount;
    
          return {
            ...transaction, // crea nuevo objeto
            type: category_found.type || "Uncategorized",
            amount,
            balance: runningBalance
          };
        });
    };
    
    const getTransactions = async () => {
        
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/transactions/?year=${date.year}&month=${date.month}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token.access}`,
                },
                method: 'GET',
            })
            if (!res.ok){
                throw new Error('Failed to fetch transactions')
            }
            const data= await res.json()
            if (data.transactions.length === 0){
                setDate({ year: date.year, month: date.month - 1 })
                return window.location.reload()
            }
            const classified_transactions = clasifyTransactions(data.transactions, data.categories)
            setTransactions(classified_transactions)
            setCategories(data.categories)
            localStorage.setItem('transactions', JSON.stringify(classified_transactions))
            localStorage.setItem('categories', JSON.stringify(data.categories))

        }
        catch (error) {
            console.error('Error fetching transactions:', error)
        }
    }
    const deleteTransaction = async (id) =>{
      const res = await fetch('http://127.0.0.1:8000/api/transactions/',{
        headers: {'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.access}`
        },
        method: 'delete',
        body: JSON.stringify({'id':id})
    })
      if (res.ok){
        window.location.reload()
        return console.log('transaction deleted')
      }
    }

    
    useEffect(()=>{
        getTransactions();
    },[date])


  return (
    <>
    <div className="card mb-4">
      <div className="card-header">
        <i className="fas fa-table me-1"></i>
        Recent Transactions
        <div>
        <button
          onClick={()=>{
          setEditId(-1)
          setShowModal(true)
        }}
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#transactionModal">
        Add Transaction</button>
        <button className="btn btn-danger" onClick={handleDateBack}>Previous</button>
        <button className="btn btn-success" onClick={handleDateForward}>Forward</button>
        </div>

      </div>
      <div className="card-body">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const categoryFound = categories.find(category => category.id === transaction.category) || {}
              return(
                <>

                <tr key={transaction.id} id ={transaction.id} onContextMenu={(e)=>{handleMenuClick(e, transaction.id)}}>


                    <td>{categoryFound.name}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.date}</td>
                </tr>
                </>

  )})}
          </tbody>
        </table>
      </div>
    </div>
    {showMenu && (
    <ul
      style={{
        position: "absolute",
        top: menuPosition.y,
        left: menuPosition.x,
        background: "white",
        border: "1px solid #ccc",
        padding: "5px 0",
        listStyle: "none",
        zIndex: 1000,
        boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
      }}
    >
      <li style={{ padding: "5px 20px", cursor: "pointer" }}>
        <button 
          onClick={()=>{
            setEditId(menuPosition.id)
            setShowModal(true)
          }}
          data-bs-target="#transactionModal"
      >Editar</button></li>
                <li style={{ padding: "5px 20px", cursor: "pointer" }}>
                  <button onClick={()=>deleteTransaction(menuPosition.id)}>

                    Eliminar
                  </button>

                </li>
                <li style={{ padding: "5px 20px", cursor: "pointer" }}>Ver Detalles</li>
              </ul>
            )}
    <TransactionModal key={editId} id={editId} showModal={showModal} />
    </>
  );
};

export default TransactionsTable;
