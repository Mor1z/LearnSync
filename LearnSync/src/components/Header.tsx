// src/components/Header.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
    { name: 'Главная', path: '/' },
    { name: 'Курсы', path: '/courses' },
    { name: 'Профиль', path: '/profile' },
];

const Header: React.FC = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-gray-900 text-white shadow-lg">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Логотип */}
                <div className="text-xl font-bold flex items-center space-x-2">
                    <span>🎓</span>
                    <span>MyLearningPlatform</span>
                </div>

                {/* Навигация (десктоп) */}
                <nav className="hidden md:flex space-x-6">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`relative group transition-all duration-300 pb-1 ${
                                location.pathname === item.path
                                    ? 'text-gray-400 pointer-events-none'
                                    : 'text-white hover:text-blue-400'
                            }`}
                        >
                            {item.name}
                            <span
                                className={`absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100 ${
                                    location.pathname === item.path ? 'scale-x-100' : ''
                                }`}
                            ></span>
                        </Link>
                    ))}
                </nav>

                {/* Мобильное меню (бургер) */}
                <button
                    className="md:hidden text-white focus:outline-none"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                </button>
            </div>

            {/* Мобильное меню */}
            {isMenuOpen && (
                <nav className="md:hidden bg-gray-800 px-4 py-2 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`block py-2 transition-colors ${
                                location.pathname === item.path
                                    ? 'text-gray-400 pointer-events-none'
                                    : 'text-white hover:text-blue-400'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            )}
        </header>
    );
};

export default Header;