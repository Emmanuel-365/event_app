import { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { logout as logoutService } from './services/authService';

const NavLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <Link to={to} className="text-neutral-600 hover:text-primary-600 dark:text-neutral-300 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick }: { to: string, children: React.ReactNode, onClick: () => void }) => (
    <Link to={to} onClick={onClick} className="text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800 block px-3 py-2 rounded-md text-base font-medium transition-colors">
        {children}
    </Link>
);


function App() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = async () => {
    try {
      await logoutService();
      logout();
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link className="text-xl font-bold text-neutral-900 dark:text-white" to="/">EventApp</Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink to="/">Home</NavLink>
                  {user?.role === 'ROLE_ORGANIZER' && (
                    <>
                      <NavLink to="/dashboard">Dashboard</NavLink>
                      <NavLink to="/create-event">Create Event</NavLink>
                      <NavLink to="/my-events">My Events</NavLink>
                      <NavLink to="/member-management">Manage Members</NavLink>
                    </>
                  )}
                  {user?.role === 'ROLE_VISITOR' && (
                    <NavLink to="/my-subscriptions">My Subscriptions</NavLink>
                  )}
                  {user?.role === 'ROLE_ADMIN' && (
                    <NavLink to="/admin/dashboard">Admin Dashboard</NavLink>
                  )}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button onClick={toggleTheme} className="p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-100 dark:focus:ring-offset-neutral-900 focus:ring-primary-500">
                  {theme === 'light' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  )}
                </button>
                {user ? (
                  <div className="ml-3 relative">
                    <div>
                      <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="max-w-xs bg-neutral-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                          <span className="text-white font-semibold">{(user.email || '?').charAt(0).toUpperCase()}</span>
                        </div>
                      </button>
                    </div>
                    {isDropdownOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                        <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700" role="menuitem">My Profile</Link>
                        <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700" role="menuitem">
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link to="/login" className="text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">Login</Link>
                    <Link to="/register" className="text-white bg-primary-600 hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">Register</Link>
                  </div>
                )}
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 dark:text-neutral-400 hover:text-white hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-800 focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavLink to="/" onClick={closeMobileMenu}>Home</MobileNavLink>
              {user?.role === 'ROLE_ORGANIZER' && (
                <>
                  <MobileNavLink to="/dashboard" onClick={closeMobileMenu}>Dashboard</MobileNavLink>
                  <MobileNavLink to="/create-event" onClick={closeMobileMenu}>Create Event</MobileNavLink>
                  <MobileNavLink to="/my-events" onClick={closeMobileMenu}>My Events</MobileNavLink>
                  <MobileNavLink to="/member-management" onClick={closeMobileMenu}>Manage Members</MobileNavLink>
                </>
              )}
              {user?.role === 'ROLE_ADMIN' && (
                <MobileNavLink to="/admin/dashboard" onClick={closeMobileMenu}>Admin Dashboard</MobileNavLink>
              )}
              {user?.role === 'ROLE_VISITOR' && (
                <MobileNavLink to="/my-subscriptions" onClick={closeMobileMenu}>My Subscriptions</MobileNavLink>
              )}
            </div>
            <div className="pt-4 pb-3 border-t border-neutral-700">
              {user ? (
                <div className="px-2 space-y-1">
                  <MobileNavLink to="/profile" onClick={closeMobileMenu}>My Profile</MobileNavLink>
                  <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-neutral-400 hover:text-white hover:bg-neutral-700">Logout</button>
                </div>
              ) : (
                <div className="px-2 space-y-1">
                  <MobileNavLink to="/login" onClick={closeMobileMenu}>Login</MobileNavLink>
                  <MobileNavLink to="/register" onClick={closeMobileMenu}>Register</MobileNavLink>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;