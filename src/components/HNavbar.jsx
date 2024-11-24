import { Link } from 'react-router-dom';
import { User, Clock, Home, CheckSquare, LogOut } from 'lucide-react';

const navItems = [
    { icon: Home, href: '/home', label: 'Home' },
    { icon: User, href: '/profile', label: 'Profile' },
    { icon: Clock, href: '/schedule', label: 'Schedule' },
    { icon: CheckSquare, href: '/tasks', label: 'Tasks' },
];

export default function HNavbar() {
    return (
        <nav className="min-h-screen w-16 bg-white shadow-md flex flex-col items-center py-4 space-y-4">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    to={item.href}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                    <item.icon className="w-6 h-6 text-gray-600" />
                    <span className="sr-only">{item.label}</span>
                </Link>
            ))}
            <div className="flex-grow"></div> {/* Esto asegura que el ícono de Logout se mantenga en el fondo */}
            <Link
                to="/logout"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 mt-auto"
            >
                <LogOut className="w-6 h-6 text-gray-600" />
                <span className="sr-only">Logout</span>
            </Link>
        </nav>
    );
}
