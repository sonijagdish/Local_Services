import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import AppRouter from './AppRouter.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from "react-hot-toast";

import { initializeTheme } from "./utils/themeInit";

initializeTheme();

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={AppRouter} />
    <Toaster position="top-right" reverseOrder={false} />
  </AuthProvider>
);
