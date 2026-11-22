export type NavTab = 'booking' | 'info' | 'appointments';

interface NavbarProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  isOwnerAuthenticated: boolean;
  appointmentsCount: number;
  onLogout: () => void;
}

export function Navbar({
  activeTab,
  onChangeTab,
  isOwnerAuthenticated,
  appointmentsCount,
  onLogout,
}: NavbarProps) {
  return (
    <nav className="navbar" aria-label="Navegación principal">
      <div className="navbar-inner">
        <button
          type="button"
          className="brand"
          onClick={() => onChangeTab('booking')}
        >
          <span className="brand-dot" aria-hidden="true" />
          <span>Reservación</span>
        </button>

        <div className="nav-links">
          <button
            type="button"
            className={`nav-link ${activeTab === 'booking' ? 'active' : ''}`}
            onClick={() => onChangeTab('booking')}
          >
            Reservar cita
          </button>

          <button
            type="button"
            className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => onChangeTab('info')}
          >
            Información
          </button>

          <button
            type="button"
            className={`nav-link ${activeTab === 'appointments' ? 'active' : ''}`}
            onClick={() => onChangeTab('appointments')}
          >
            <span>Citas</span>
            {isOwnerAuthenticated && (
              <span className="nav-count">{appointmentsCount}</span>
            )}
          </button>
        </div>

        <div className="nav-actions">
          {isOwnerAuthenticated ? (
            <>
              <span className="owner-chip">Modo dueño</span>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onLogout}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onChangeTab('appointments')}
            >
              Acceso dueño
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
