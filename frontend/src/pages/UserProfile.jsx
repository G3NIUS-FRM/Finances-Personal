import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";


export default function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const res = await fetch("http://127.0.0.1:8000/api/profile/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.access}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener perfil");

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      {/* Contenedor de contenido del layout */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 56px)", // 56px aprox altura del navbar
          width: "100%",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div className="card shadow-lg text-center" style={{ width: "22rem" }}>
          <div className="card-body">
            <img
              src={`http://127.0.0.1:8000${user.profile_picture}`}
              alt="Profile"
              className="rounded-circle mb-3"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
            <h4 className="card-title">
              {user.first_name} {user.last_name}
            </h4>
            <p className="card-text text-muted">@{user.username}</p>
            <p className="card-text">{user.email}</p>
            <p className="card-text">
              <small className="text-muted">
                Miembro desde {new Date(user.date_joined).toLocaleDateString()}
              </small>
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
