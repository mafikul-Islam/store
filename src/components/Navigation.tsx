import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Package, User, Sun, Moon } from 'lucide-react';
import { logout } from '../lib/store';
import { useAuth } from '../lib/hooks';
import { useTheme } from './ThemeProvider';
import { useCart } from './CartProvider';

export default function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuth, user, admin } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { cartCount } = useCart();

    const handleLogout = async (e: React.MouseEvent) => {
        e.preventDefault();
        await logout();
        navigate('/');
    };

    const linkBaseClass = "text-sm font-medium transition-colors hover:text-black dark:hover:text-white";
    const activeClass = "text-black dark:text-white";
    const inactiveClass = "text-gray-500 dark:text-gray-400";

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md transition-colors duration-200">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <Package className="h-6 w-6 stroke-2" />
                        <span className="font-serif text-xl font-bold tracking-tight">Mafikul's Store</span>
                    </Link>
                    
                    <div className="hidden md:flex gap-6">
                        <Link to="/" className={`${linkBaseClass} ${location.pathname === '/' ? activeClass : inactiveClass}`}>Home</Link>
                        <Link to="/products" className={`${linkBaseClass} ${location.pathname === '/products' ? activeClass : inactiveClass}`}>Shop</Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={toggleTheme} 
                        className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                    </button>
                    
                    {isAuth ? (
                        <>
                            {admin && (
                                <Link to="/admin" className={`${linkBaseClass} ${location.pathname.startsWith('/admin') ? activeClass : inactiveClass}`}>
                                    Admin Dashboard
                                </Link>
                            )}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline-block">Hi, {user?.name.split(' ')[0]}</span>
                                <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors ml-2 sm:ml-0">
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden md:inline">Logout</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link to="/admin/login" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                            <User className="h-4 w-4" />
                            <span className="hidden md:inline">Login</span>
                        </Link>
                    )}
                    
                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-2 hidden md:block" />
                    
                    <Link to="/cart" className="flex items-center gap-2 text-gray-900 dark:text-white group relative">
                        <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-black dark:bg-white text-[10px] font-bold text-white dark:text-black">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
