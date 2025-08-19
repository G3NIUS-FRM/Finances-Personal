import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useMemo } from 'react';

export default function TransactionsChart({ transactions }) {
  // Ordenar por fecha ascendent
  const chartData = useMemo(() => {
    if (!transactions) return [];
    // Clonar y ordenar por fecha ascendente
    return [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions]);
  return (
    <LineChart width={1200} height={300} data={transactions}>
      <CartesianGrid />
      <Line  type="monotone" dataKey="balance" stroke="#8884d8" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
}
