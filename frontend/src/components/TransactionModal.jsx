import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function TransactionModal({id=-1}) {
  const categories = JSON.parse(localStorage.getItem('categories'))||[]
  const token = JSON.parse(localStorage.getItem('token')) || ''
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    description: "",
    date: ""
  });
  const modalRef = useRef(null);
  useEffect(() => {
    if (id !== -1){
      console.log('Editando')
      const transactions = JSON.parse(localStorage.getItem('transactions'))
      const transaction = transactions.find(t => t.id === id)
      setFormData({    
        category: transaction.category,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date,
    })}
}, [id])

  useEffect(() => {
    if (id !== -1) {
      const modal = new window.bootstrap.Modal(modalRef.current);
      modal.show();
    }
  }, [ id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleEdit = (e) => {
    e.preventDefault();
    formData.id = id
    fetch('http://127.0.0.1:8000/api/transactions/', {
        headers: {'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.access}`
        },
        method: 'PUT',
        body: JSON.stringify(formData)
    })
    .then(res=>{
        if (res.ok){
            return res.json()
        }else{
            throw new Error('Failed to create transaction')
        }
    })
    .then(data => {
        console.log('transaction edited')
        setFormData({    
            category: "",
            amount: "",
            description: "",
            date: ""
        })
        window.location.href= '/dashboard'
    })}
    // Aquí puedes llamar a tu API o manejar la lógica




  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:8000/api/transactions/', {
        headers: {'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.access}`
        },
        method: 'POST',
        body: JSON.stringify(formData)
    })
    .then(res=>{
        if (res.ok){
            return res.json()
        }else{
            throw new Error('Failed to create transaction')
        }
    })
    .then(data => {
        console.log('transaction created')
        setFormData({    
            category: "",
            amount: "",
            description: "",
            date: ""
        })
        window.location.href= '/dashboard'
    })
    // Aquí puedes llamar a tu API o manejar la lógica
  };


  
  return (
    <div className="container mt-4">
      {/* Botón para abrir el modal */}

      {/* Modal */}
      <div
        key={id}
        className="modal fade"
        id="transactionModal"
        tabIndex="-1"
        aria-labelledby="transactionModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            
            <div className="modal-header">
              <h5 className="modal-title" id="transactionModalLabel">
                {id === -1 ? "Agregar Transaction" : 'Editar Transaction'}
              </h5>
              <button
                type="button"
                onClick={()=>{window.location.href='/dashboard'}}
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={id === -1 ? handleSubmit : handleEdit}>
                
                {/* Category */}
                <div className="mb-3">
                  <label className="form-label">Categoría</label>
                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((category)=>{
                        return (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        )
                    })}
                  </select>
                </div>

                {/* Amount */}
                <div className="mb-3">
                  <label className="form-label">Monto</label>
                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">Descripción</label>
                  <input
                    type="text"
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Date */}
                <div className="mb-3">
                  <label className="form-label">Fecha</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="modal-footer">
                  <button
                  onClick={()=>{window.location.href='/dashboard'}}
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {id === -1 ? "Guardar" : 'Editar'}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
