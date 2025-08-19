import DashboardLayout from "../layouts/DashboardLayout";
import TransactionsTable from "../components/TransactionsTable";
import TransactionsChart from "../components/TransactionsChart";
import { useState } from "react";
export default function Dashboard() {
  const [transactions, setTransactions] = useState([])
  return (
    <DashboardLayout>
      <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <h1 className="mt-4">Dashboard</h1>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item active">Dashboard</li>
              </ol>

              {/* Cards */}
              <div className="row">
              {transactions.length > 0 && <TransactionsChart transactions={transactions}/>}
                {/* Repite para los demás cards */}
              </div>
              <TransactionsTable transactions={transactions} setTransactions={setTransactions}/>

              {/* Aquí puedes agregar gráficos y tablas */}

            </div>
          </main>
        </div>

    </DashboardLayout>
  );
}
