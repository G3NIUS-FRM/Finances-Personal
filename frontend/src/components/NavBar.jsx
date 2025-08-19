import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTransactions, setSearchTransactions] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));
  const wrapperRef = useRef(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) return;

    const res = await fetch("http://127.0.0.1:8000/api/transactions/search/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.access}`,
      },
      method: "POST",
      body: JSON.stringify({ search_term: searchTerm }),
    });
    const data = await res.json();
    setSearchTransactions(data);
    setShowResults(true);
  };

  // Cierra si hago click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
      <a className="navbar-brand ps-3" href="/">
        Finances Personal
      </a>
      <button
        className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0"
        id="sidebarToggle"
        href="#!"
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Buscador con resultados */}
      <form
        className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0"
        onSubmit={handleSearch}
        ref={wrapperRef}
        style={{ position: "relative" }} // 👈 para anclar la lista al input
      >
        <div className="input-group">
          <input
            className="form-control"
            type="text"
            placeholder="Search for..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!e.target.value) setShowResults(false);
            }}
            onFocus={() => {
              if (searchTransactions) setShowResults(true);
            }}
          />
          <button className="btn btn-primary" type="submit">
            <i className="fas fa-search"></i>
          </button>
        </div>

        {/* Resultados debajo */}
        {showResults && searchTransactions && (
          <ul
            className="list-group position-absolute w-100 mt-1"
            style={{ zIndex: 2000 }}
          >
            {searchTransactions.length > 0 ? (
              searchTransactions.map((tran, idx) => (
                <li
                  key={idx}
                  className="list-group-item list-group-item-action"
                  onClick={() => {
                    setSearchTerm(tran.description);
                    setShowResults(false);
                    
                  }}
                >
                  <a href={'#'+String(idx)}>{tran.description} - {tran.amount} - {tran.date}</a>
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">Sin resultados</li>
            )}
          </ul>
        )}
      </form>

      <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-user fa-fw"></i>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-end"
            aria-labelledby="navbarDropdown"
          >
            <li>
              <a className="dropdown-item" href="../user-profile">
                Settings
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item" href="/">
                Logout
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}
