import React from 'react'
import Navbar from '../components/NavBar'
import Sidebar from '../components/SideBar'
import { useEffect } from 'react'
export default function DashboardLayout({children}) {
  useEffect(() => {
    const refreshAccessToken = async () => {
      const token = JSON.parse(localStorage.getItem("token"));
      if (!token || !token.refresh) {
        window.location.href = "/login";
        return;
      }
  
      try {
        const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: token.refresh }),
        });
  
        if (!res.ok) {
          window.location.href = "/login";
          return;
        }
  
        const data = await res.json();
        token.access = data.access;
        localStorage.setItem("token", JSON.stringify(token));
      } catch (error) {
        console.error("Error refreshing token:", error);
        window.location.href = "/login";
      }
    };
  
    refreshAccessToken();
  }, []); // se ejecuta solo una vez al montar
  return (
    <div className="sb-nav-fixed">
    <Navbar />
    <div id="layoutSidenav">
      <Sidebar />
      <main className="flex-grow-1 container my-4">
      {children}

      </main>
    </div>
  </div>
  )
}
