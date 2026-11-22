import { useState, type SubmitEvent } from 'react';

interface OwnerLoginProps {
  onLoginSuccess: () => void;
}

const DEMO_OWNER_USER = 'dueno@local.com';
const DEMO_OWNER_PASS = '123456';

export function OwnerLogin({ onLoginSuccess }: OwnerLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError(null);

    if (username.trim().toLowerCase() === DEMO_OWNER_USER && password === DEMO_OWNER_PASS) {
      onLoginSuccess();
      return;
    }

    setLoginError('Usuario o contraseña incorrectos.');
  }

  function fillDemoCredentials() {
    setUsername(DEMO_OWNER_USER);
    setPassword(DEMO_OWNER_PASS);
    setLoginError(null);
  }

  return (
    <section className="card login-card">
      <h2>Acceso del dueño del local</h2>
      <p className="muted">
        Inicia sesión para ver las citas creadas, confirmarlas, reprogramarlas o administrar los servicios.
      </p>

      <div className="demo-hint">
        <div>
          <strong>Credenciales de prueba (solo frontend):</strong>
          <div className="muted">
            Usuario: <code>{DEMO_OWNER_USER}</code> · Contraseña: <code>{DEMO_OWNER_PASS}</code>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={fillDemoCredentials}
        >
          Autocompletar
        </button>
      </div>

      {loginError && (
        <div className="alert alert-error" role="alert">
          <span>{loginError}</span>
        </div>
      )}

      <form className="stack" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="owner-username">Usuario o correo</label>
          <input
            id="owner-username"
            type="text"
            required
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={DEMO_OWNER_USER}
          />
        </div>

        <div className="field">
          <label htmlFor="owner-password">Contraseña</label>
          <input
            id="owner-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Ingresar al panel de citas
        </button>
      </form>
    </section>
  );
}
