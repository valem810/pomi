import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Clock, Home, CheckSquare, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const navItems = [
    { icon: Home, href: '/home', label: 'Home' },
    { icon: User, href: '/profile', label: 'Profile' },
    { icon: Clock, href: '/clock', label: 'Clock' },
    { icon: CheckSquare, href: '/tasks', label: 'Tasks' },
];

export default function HNavbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Cierra sesión en Firebase
            await signOut(auth);

            // Limpia el localStorage
            localStorage.removeItem('user');

            // Redirige al Landing
            navigate('/');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <nav className="min-h-screen w-16 bg-[#000000] shadow-md flex flex-col items-center py-4 space-y-4">
            {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        to={item.href}
                        className="p-2 rounded-lg transition-colors duration-200"
                    >
                        <item.icon
                            className={`w-6 h-6 transition-colors duration-200 ${
                                isActive
                                    ? 'text-[#ffffff]'
                                    : 'text-[#d6d6d6] hover:text-[#ffffff]'
                            }`}
                        />
                        <span className="sr-only">{item.label}</span>
                    </Link>
                );
            })}
            <div className="flex-grow"></div> {/* Esto asegura que el ícono de Logout se mantenga en el fondo */}
            <button
                onClick={handleLogout}
                className="p-2 rounded-lg transition-transform duration-200 mt-auto"
            >
                <LogOut className="w-6 h-6 text-[#ffffff]" />
                <span className="sr-only">Logout</span>
            </button>
        </nav>
    );
}
