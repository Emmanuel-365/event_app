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
import MyEvents from './pages/MyEvents';
import EditEvent from './pages/EditEvent';
import MySubscriptions from './pages/MySubscriptions';
import EventSubscribers from './pages/EventSubscribers';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from "./pages/Dashboard.tsx";
import EventStats from "./pages/EventStats.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
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
      {
        path: '/my-events',
        element: (
          <ProtectedRoute role="ORGANIZER">
            <MyEvents />
          </ProtectedRoute>
        ),
      },
      {
        path: '/edit-event/:id',
        element: (
          <ProtectedRoute role="ORGANIZER">
            <EditEvent />
          </ProtectedRoute>
        ),
      },
        {
            path: '/dashboard',
            element: (
                <ProtectedRoute role="ORGANIZER">
                    <Dashboard />
                </ProtectedRoute>
            ),
        },
        {
            path: '/event-stats/:id',
            element: (
                <ProtectedRoute role="ORGANIZER">
                    <EventStats />
                </ProtectedRoute>
            ),
        },
      {
        path: '/my-subscriptions',
        element: (
          <ProtectedRoute>
            <MySubscriptions />
          </ProtectedRoute>
        ),
      },
      {
        path: '/event-subscribers/:id',
        element: (
          <ProtectedRoute role="ORGANIZER">
            <EventSubscribers />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <Profile />
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