export default function Sidebar() {
  return (
    <div id="layoutSidenav_nav">
      <nav className="sb-sidenav accordion sb-sidenav-dark bg-dark" id="sidenavAccordion">
        <div className="sb-sidenav-menu">
          <div className="nav">
            <div className="sb-sidenav-menu-heading text-white">Core</div>
            <a className="nav-link text-white" href="/dashboard">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Dashboard
            </a>
            <a className="nav-link text-white" href="/reports">
              <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
              Reports
            </a>


          </div>
        </div>

        <div className="sb-sidenav-footer bg-secondary text-white">
          <div className="small">Logged in as:</div>
          {localStorage.getItem('username')}
        </div>
      </nav>
    </div>
  );
}
