import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterVisitor from './pages/RegisterVisitor';
import RegisterOrganizer from './pages/RegisterOrganizer';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import ProtectedRoute from './components/ProtectedRoute';
import MemberManagement from './pages/MemberManagement';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: '/login', element: <Login /> },
      { path: '/register-visitor', element: <RegisterVisitor /> },
      { path: '/register-organizer', element: <RegisterOrganizer /> },
      {
        path: '/create-event',
        element: (
          <ProtectedRoute role="ORGANIZER">
            <CreateEvent />
          </ProtectedRoute>
        ),
      },
      {
        path: '/member-management',
        element: (
          <ProtectedRoute role="ORGANIZER">
            <MemberManagement />
          </ProtectedRoute>
        ),
      },
      { path: '/event/:id', element: <ProtectedRoute><EventDetails /></ProtectedRoute> },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;