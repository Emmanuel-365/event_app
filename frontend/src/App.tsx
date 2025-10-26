import { Outlet, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { logout as logoutService } from './services/authService';

function App() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutService();
      logout();
      window.location.href = '/login'; // Redirect to login after logout
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">EventApp</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              {user ? (
                <>
                  {user.role === 'ORGANIZER' && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/create-event">Create Event</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/member-management">Manage Members</Link>
                      </li>
                    </>
                  )}
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={handleLogout}>Logout ({user.email})</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register-visitor">Register as Visitor</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register-organizer">Register as Organizer</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <main className="container mt-4">
        <Outlet />
      </main>
    </>
  );
}

export default App;