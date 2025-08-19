import React from "react";
import Moneda from '../assets/Moneda.png'

export default function Home() {
  return (
    <>
    {/* Navbar */}
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container px-5">
        <a className="navbar-brand" href="#!"><img src={Moneda} alt="" style={{'width':50, "height":50}}/></a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="/login">Sign in</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    {/* Header */}
    <header className="bg-dark py-5">
      <div className="container px-5">
        <div className="row gx-5 justify-content-center">
          <div className="col-lg-6">
            <div className="text-center my-5">
              <h1 className="display-5 fw-bolder text-white mb-2">
              Tu dinero bajo control, tu futuro asegurado
              </h1>
              <p className="lead text-white-50 mb-4">
              Organiza tus gastos, ahorra de manera efectiva y toma decisiones financieras con confianza. Empieza hoy a construir un futuro más seguro y próspero.
              </p>
              <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
                <a className="btn btn-primary btn-lg px-4 me-sm-3" href="#features">Get Started</a>

              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    {/* Features Section */}
    <section className="py-5 border-bottom" id="features">
      <div className="container px-5 my-5">
        <div className="row gx-5">
          {[{
            icon: "bi-journal-check",
            title: "Registro y Categorías de Gastos e Ingresos",
            text: "Lleva un control detallado de tus transacciones, clasificándolas por categorías personalizables para entender mejor en qué gastas y de dónde viene tu dinero."
          }, {
            icon: "bi-bell",
            title: "Presupuestos y Alertas Personalizadas",
            text: "Establece presupuestos mensuales para diferentes categorías y recibe notificaciones cuando te acerques o excedas esos límites, ayudándote a mantener tus finanzas bajo control."
          }, {
            icon: "bi-bar-chart-line",
            title: "Reportes y Análisis Visuales",
            text: "Obtén gráficos y reportes dinámicos que muestran tu flujo de dinero, ahorro y tendencias de gasto, facilitando la toma de decisiones financieras inteligentes."
          }].map(({icon, title, text}, i) => (
            <div key={i} className={`col-lg-4 mb-5 mb-lg-0`}>
              <div className="feature bg-primary bg-gradient text-white rounded-3 mb-3">
                <i className={`bi ${icon}`}></i>
              </div>
              <h2 className="h4 fw-bolder">{title}</h2>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-5 bg-dark">
      <div className="container px-5">
        <p className="m-0 text-center text-white">
          Copyright &copy; Finances Personal by Adrian 2025
        </p>
      </div>
    </footer>
  </>
  );
}
