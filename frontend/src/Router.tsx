import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateEvent from './pages/CreateEvent';
import { EventDetails } from './pages/EventDetails';
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
import TicketScanner from "./pages/TicketScanner.tsx";
import PaymentSimulation from "./pages/PaymentSimulation.tsx";
import AdminLayout from "./pages/AdminDashboard";
import UserManagementPage from "./pages/UserManagementPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminEventManagement from "./pages/AdminEventManagement";
import AdminCommentModeration from "./pages/AdminCommentModeration";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password', element: <ResetPassword /> },
      {
        path: '/create-event',
        element: (
          <ProtectedRoute role="ROLE_ORGANIZER">
            <CreateEvent />
          </ProtectedRoute>
        ),
      },
      {
        path: '/member-management',
        element: (
          <ProtectedRoute role="ROLE_ORGANIZER">
            <MemberManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: '/my-events',
        element: (
          <ProtectedRoute role="ROLE_ORGANIZER">
            <MyEvents />
          </ProtectedRoute>
        ),
      },
      {
        path: '/edit-event/:id',
        element: (
          <ProtectedRoute role="ROLE_ORGANIZER">
            <EditEvent />
          </ProtectedRoute>
        ),
      },
        {
            path: '/dashboard',
            element: (
                <ProtectedRoute role="ROLE_ORGANIZER">
                    <Dashboard />
                </ProtectedRoute>
            ),
        },
        {
            path: '/event-stats/:id',
            element: (
                <ProtectedRoute role="ROLE_ORGANIZER">
                    <EventStats />
                </ProtectedRoute>
            ),
        },
        {
            path: '/ticket-scanner',
            element: (
                <ProtectedRoute role="ROLE_ORGANIZER">
                    <TicketScanner />
                </ProtectedRoute>
            ),
        },
      {
        path: '/admin',
        element: (
          <ProtectedRoute role="ROLE_ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { path: 'dashboard', element: <AdminDashboardPage /> },
          { path: 'users', element: <UserManagementPage /> },
          { path: 'events', element: <AdminEventManagement /> },
          { path: 'comments', element: <AdminCommentModeration /> },
        ],
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
        path: '/payment/:subscriptionId',
        element: (
          <ProtectedRoute role="ROLE_VISITOR">
            <PaymentSimulation />
          </ProtectedRoute>
        ),
      },
      {
        path: '/event-subscribers/:id',
        element: (
          <ProtectedRoute role="ROLE_ORGANIZER">
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