import React, { useState, useEffect } from "react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import DashboardLayout from "../layouts/DashboardLayout";

export default function ReportPage() {
  const [transactions, setTransactions] = useState([]);
  const [direccion, setDireccion] = useState(0);
  const [balance, setBalance] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const token = JSON.parse(localStorage.getItem("token"))?.access;

  // Función para calcular el porcentaje de cambio
  const determinarDireccion = (lastAmount, totalBalance) => {
    if (!lastAmount || !totalBalance) return;
    const porcentaje = (lastAmount / totalBalance) * 100;
    setDireccion(Number(porcentaje.toFixed(2))); // redondea a 2 decimales
  };

  // Fetch de reportes
  const fetchReports = async () => {
    if (!startDate || !endDate) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/reports/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ start_date: startDate, end_date: endDate }),
      });

      if (!res.ok) throw new Error("Error al obtener los reportes");

      const data = await res.json();
      if (!data.transactions || data.transactions.length === 0) {
        return alert('No se encontraron transacciones para el rango de fechas seleccionado');
      }

      setTransactions(data.transactions);
      setBalance(data.balance || 0);
      determinarDireccion(data.transactions[data.transactions.length - 1].amount, data.balance);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate]);

  return (
    <DashboardLayout>
      <div className="d-flex flex-column justify-content-center align-items-center p-4">
        <div className="w-100" style={{ maxWidth: "900px" }}>
          <h1 className="text-center mb-4">Reporte de Balance</h1>

          {/* Inputs de fecha */}
          <div className="d-flex justify-content-center gap-3 mb-4">
            <div className="form-group">
              <label>Fecha Inicio</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Fecha Fin</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-control"
              />
            </div>
          </div>

          {/* Balance y porcentaje */}
          <h2 className="text-center mb-2">Balance: ${balance}</h2>
          <h4 className="text-center mb-4">
            Dirección del dinero: {direccion > 0 ? `Sube +${direccion}%` : `Baja ${direccion}%`}
          </h4>

          {/* Gráfico */}
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={transactions}>
              <Line type="monotone" dataKey="amount" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
}
