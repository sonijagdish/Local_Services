import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/admin/AdminPanel';
import ServiceList from './pages/ServiceList';
import ServiceDetails from './pages/ServiceDetails';
import ProtectedRoute from './components/ProtectedRoute';
import ProviderPanel from './pages/provider/ProviderPanel';
import ProviderProfile from './pages/ProviderProfile';
import AdminAnalytics from './pages/AdminAnalytics';
import Invoice from './pages/Invoice';
import Support from './pages/Support';
import PaymentSuccess from './pages/PaymentSuccess';

const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'services',
        element: <ServiceList />,
      },
      {
        path: 'services/:id',
        element: <ServiceDetails />,
      },
      {
        path: 'payment-success',
        element: <PaymentSuccess />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute role="user">
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'invoice/:bookingId',
        element: (
          <ProtectedRoute role="user">
            <Invoice />
          </ProtectedRoute>
        ),
      },
      {
        path: 'support',
        element: (
          <ProtectedRoute role="user">
            <Support />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute role="admin">
            <AdminPanel />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/analytics',
        element: (
          <ProtectedRoute role="admin">
            <AdminAnalytics />
          </ProtectedRoute>
        ),
      },
      {
        path: 'provider/dashboard',
        element: (
          <ProtectedRoute role="provider">
            <ProviderPanel />
          </ProtectedRoute>
        ),
      },
      {
        path: 'provider/profile',
        element: (
          <ProtectedRoute role="provider">
            <ProviderProfile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default AppRouter;
