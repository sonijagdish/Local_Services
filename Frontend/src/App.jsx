import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SupportChatbot from './components/SupportChatbot';
import OfflineOverlay from './components/OfflineOverlay';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar className="" />

      <main className="flex-grow w-full">
        <Outlet />
      </main>

      <SupportChatbot />
      <OfflineOverlay />
      <Footer />
    </div>
  );
}

export default App;
