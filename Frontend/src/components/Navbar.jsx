import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Zap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import toast from 'react-hot-toast';
import {
  getNotifications,
  markAllRead,
  deleteNotification,
} from '../utils/notification';
import { playNotificationSound } from '../utils/notificationSound';
import { FaBell } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifRefresh, setNotifRefresh] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const prevUnreadCountRef = useRef(0);
  const deskNotifRef = useRef(null);
  const mobNotifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideDesk = deskNotifRef.current && deskNotifRef.current.contains(event.target);
      const isInsideMob = mobNotifRef.current && mobNotifRef.current.contains(event.target);
      
      if (!isInsideDesk && !isInsideMob) {
        setNotifOpen(false);
      }
    };

    if (notifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleNewNotif = () => setNotifRefresh((prev) => !prev);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('new-notification', handleNewNotif);
    window.addEventListener('storage', handleNewNotif);

    const fetchNotifs = async () => {
        if (user) {
            try {
                const data = await getNotifications();
                const newUnreadCount = data.filter((n) => !n.read).length;

                // Play sound only when NEW unread notifications arrive
                if (newUnreadCount > prevUnreadCountRef.current && prevUnreadCountRef.current !== 0) {
                  playNotificationSound();
                }
                prevUnreadCountRef.current = newUnreadCount;

                setNotifications(data);
            } catch (err) {
                console.error("Failed to sync notifications");
            }
        } else {
            setNotifications([]);
            prevUnreadCountRef.current = 0;
        }
    };

    fetchNotifs();

    // Poll for new notifications every 15 seconds
    const pollInterval = setInterval(fetchNotifs, 15000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('new-notification', handleNewNotif);
      window.removeEventListener('storage', handleNewNotif);
      clearInterval(pollInterval);
    };
  }, [user, notifRefresh]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  const navLinkStyles = ({ isActive }) => `
    relative transition-all duration-300 uppercase tracking-widest text-[11px] font-black
    ${isActive
      ? 'text-blue-600 dark:text-blue-400'
      : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'}
  `;

  const getNotifStyles = (notif) => {
    if (notif.read) return 'bg-gray-50/50 dark:bg-gray-800/50 border-transparent';
    
    switch(notif.type) {
      case 'success': return 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/20';
      case 'warning': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-900/20';
      case 'error': return 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/20';
      default: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/20';
    }
  };

  const getNotifTitleColor = (notif) => {
    if (notif.read) return 'text-gray-900 dark:text-white';
    
    switch(notif.type) {
        case 'success': return 'text-green-600 dark:text-green-400';
        case 'warning': return 'text-orange-600 dark:text-orange-400';
        case 'error': return 'text-red-600 dark:text-red-400';
        default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  const ActiveIndicator = () => (
    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
  );

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg border-b border-gray-100 dark:border-gray-800 py-2'
        : 'bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-4'
      }`}>
      <div className="max-w-7xl mx-auto px-6 h-12 flex items-center justify-between">

        {/* LOGO AREA */}
        <Link
          to="/"
          className="flex items-center gap-2 group transition-all active:scale-95"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-500 overflow-hidden relative">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Zap className="text-white fill-current" size={18} />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase font-mono group-hover:tracking-tight transition-all duration-500">
            <span className="text-gray-900 dark:text-white">Local</span>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-400 bg-clip-text text-transparent">Serve</span>
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 font-bold text-sm">
          <NavLink to="/services" className={navLinkStyles}>
            {({ isActive }) => (
              <>
                Services
                {isActive && <ActiveIndicator />}
              </>
            )}
          </NavLink>

          {user?.role === 'admin' && (
            <>
              <NavLink to="/admin" className={navLinkStyles} end>
                {({ isActive }) => (
                  <>
                    Admin
                    {isActive && <ActiveIndicator />}
                  </>
                )}
              </NavLink>
              <NavLink to="/admin/analytics" className={navLinkStyles}>
                {({ isActive }) => (
                  <>
                    Analytics
                    {isActive && <ActiveIndicator />}
                  </>
                )}
              </NavLink>
            </>
          )}

          {user?.role === 'user' && (
            <NavLink to="/dashboard" className={navLinkStyles}>
              {({ isActive }) => (
                <>
                  Dashboard
                  {isActive && <ActiveIndicator />}
                </>
              )}
            </NavLink>
          )}

          {user?.role === 'provider' && (
            <>
              <NavLink to="/provider/dashboard" className={navLinkStyles}>
                {({ isActive }) => (
                  <>
                    Dashboard
                    {isActive && <ActiveIndicator />}
                  </>
                )}
              </NavLink>
              <NavLink to="/provider/profile" className={navLinkStyles}>
                {({ isActive }) => (
                  <>
                    Profile
                    {isActive && <ActiveIndicator />}
                  </>
                )}
              </NavLink>
            </>
          )}

          {!user && (
            <>
              <NavLink to="/login" className={navLinkStyles}>
                {({ isActive }) => (
                  <>
                    Login
                    {isActive && <ActiveIndicator />}
                  </>
                )}
              </NavLink>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-95 uppercase tracking-widest text-[11px] font-black"
              >
                Register
              </Link>
            </>
          )}

          {/* Right Controls (Desktop) */}
          <div className="flex items-center gap-6 border-l pl-8 border-gray-100 dark:border-gray-800">
            <ThemeToggle />

            {/* Notifications */}
            {user && (
              <div className="relative" ref={deskNotifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className={`relative p-2 rounded-xl transition-all ${notifOpen ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
                >
                  <FaBell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white dark:ring-gray-900">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-5 w-80 bg-white dark:bg-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] p-5 z-50 border border-gray-50 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-5">
                      <h4 className="font-black text-xs uppercase tracking-widest text-gray-900 dark:text-white">Notifications</h4>
                      <button
                        onClick={async () => {
                          await markAllRead();
                        }}
                        className="text-blue-600 hover:text-blue-700 text-[10px] font-black uppercase tracking-widest"
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
                      {notifications.length === 0 ? (
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest text-center py-6 opacity-60">No notifications yet</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n._id || n.id}
                            className={`p-4 rounded-2xl text-[11px] flex justify-between items-start transition-all border ${getNotifStyles(n)}`}
                          >
                            <div className="flex-1">
                              <p className={`font-black uppercase tracking-tight mb-1 ${getNotifTitleColor(n)}`}>{n.title}</p>
                              <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{n.message}</p>
                            </div>

                            <button
                              onClick={async () => {
                                await deleteNotification(n._id || n.id);
                              }}
                              className="ml-3 text-gray-300 hover:text-red-500 transition-colors p-1"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile */}
            {user && (
              <div className="flex items-center gap-4">
                <Link to={user.role === 'admin' ? '/admin' : user.role === 'provider' ? '/provider/dashboard' : '/dashboard'} className="flex items-center gap-3 hover:opacity-80 transition group">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden lg:block leading-none">
                    <p className="text-[11px] font-black uppercase tracking-tight text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mt-0.5">{user.role}</p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Controls & Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />

          {user && (
            <div className="relative" ref={mobNotifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className={`relative p-2.5 rounded-xl transition-all ${notifOpen ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-gray-500 dark:text-gray-400'}`}
              >
                <FaBell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white dark:ring-gray-900">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="fixed inset-x-6 top-20 bg-white dark:bg-gray-800 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] p-5 z-50 border border-gray-50 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center mb-5">
                    <h4 className="font-black text-xs uppercase tracking-widest text-gray-900 dark:text-white">Notifications</h4>
                    <button
                      onClick={async () => {
                        await markAllRead();
                      }}
                      className="text-blue-600 hover:text-blue-700 text-[10px] font-black uppercase tracking-widest"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1 scrollbar-hide">
                    {notifications.length === 0 ? (
                      <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest text-center py-6 opacity-60">No notifications yet</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n._id || n.id}
                          className={`p-4 rounded-2xl text-[11px] flex justify-between items-start transition-all border ${getNotifStyles(n)}`}
                        >
                          <div className="flex-1">
                            <p className={`font-black uppercase tracking-tight mb-1 ${getNotifTitleColor(n)}`}>{n.title}</p>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{n.message}</p>
                          </div>

                          <button
                            onClick={async () => {
                              await deleteNotification(n._id || n.id);
                            }}
                            className="ml-3 text-gray-300 hover:text-red-500 transition-colors p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => { setMobileOpen(!mobileOpen); setNotifOpen(false); }}
            className="text-gray-900 dark:text-white p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-6 py-8 space-y-8 animate-in slide-in-from-top duration-500">
          <div className="flex flex-col space-y-6">
            <NavLink to="/services" onClick={() => setMobileOpen(false)} className={({ isActive }) => `text-3xl font-black uppercase tracking-tighter ${isActive ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
              Services
            </NavLink>

            {user?.role === 'admin' && (
              <>
                <NavLink to="/admin" onClick={() => setMobileOpen(false)} end className={({ isActive }) => `text-3xl font-black uppercase tracking-tighter ${isActive ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                  Admin Panel
                </NavLink>
                <NavLink to="/admin/analytics" onClick={() => setMobileOpen(false)} className={({ isActive }) => `text-3xl font-black uppercase tracking-tighter ${isActive ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                  Analytics
                </NavLink>
              </>
            )}

            {user?.role === 'user' && (
              <NavLink to="/dashboard" onClick={() => setMobileOpen(false)} className={({ isActive }) => `text-3xl font-black uppercase tracking-tighter ${isActive ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                Dashboard
              </NavLink>
            )}

            {user?.role === 'provider' && (
              <>
                <NavLink to="/provider/dashboard" onClick={() => setMobileOpen(false)} className={({ isActive }) => `text-3xl font-black uppercase tracking-tighter ${isActive ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                  Dashboard
                </NavLink>
                <NavLink to="/provider/profile" onClick={() => setMobileOpen(false)} className={({ isActive }) => `text-3xl font-black uppercase tracking-tighter ${isActive ? 'text-blue-600' : 'text-gray-900 dark:text-white'}`}>
                  Profile
                </NavLink>
              </>
            )}
          </div>

          <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col space-y-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-5 border-2 border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white text-center rounded-[2rem] font-black uppercase tracking-widest text-xs"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-5 bg-blue-600 text-white text-center rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-gray-800 rounded-[2rem]">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-lg font-black shadow-lg">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight">{user.name}</p>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.2em] mt-0.5">{user.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-red-500/20"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
