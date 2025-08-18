// Nav.jsx
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-scroll";
import { Menu, X } from 'lucide-react';
import navImg from '../Images/EEC.png';

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed w-full z-50 transition-all duration-500 ${
            scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-gradient-to-b from-blue-900/90 to-transparent py-4'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <NavLink to="/" className="flex items-center space-x-3 group">
                        <img src={navImg} className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" alt="Logo Melen" />
                        <span className={`font-bold text-xl transition-colors duration-300 ${
                            scrolled ? 'text-gray-800' : 'text-white'
                        }`}>
                            Melen
                        </span>
                    </NavLink>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="home"
                            smooth={true}
                            duration={500}
                            offset={-70}
                            className={`relative font-medium transition-all duration-300 cursor-pointer hover:scale-105 ${
                                scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-yellow-300'
                            } after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-green-400 after:to-blue-500 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full`}
                        >
                            Accueil
                        </Link>
                        <Link
                            to="about"
                            smooth={true}
                            duration={500}
                            offset={-70}
                            className={`relative font-medium transition-all duration-300 cursor-pointer hover:scale-105 ${
                                scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-yellow-300'
                            } after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-green-400 after:to-blue-500 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full`}
                        >
                            À propos
                        </Link>
                        <Link
                            to="contacts"
                            smooth={true}
                            duration={500}
                            offset={-70}
                            className={`relative font-medium transition-all duration-300 cursor-pointer hover:scale-105 ${
                                scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-yellow-300'
                            } after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-green-400 after:to-blue-500 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full`}
                        >
                            Contacts
                        </Link>

                        <NavLink
                            to="/login"
                            end
                            className={({ isActive }) => `
                                px-4 py-2 rounded-lg font-medium transition-all duration-300
                                ${scrolled
                                ? isActive ? 'text-blue-700 bg-blue-50' : 'text-blue-600 hover:bg-blue-50'
                                : isActive ? 'text-yellow-300 bg-white/10' : 'text-white hover:bg-white/10'
                            }
                            `}
                        >
                            Se connecter
                        </NavLink>

                        <NavLink
                            to="/signup"
                            className={({ isActive }) => `
                                px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg
                                ${scrolled
                                ? isActive
                                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                                    : 'bg-gradient-to-r from-green-500 to-blue-500 text-white'
                                : isActive
                                    ? 'bg-gradient-to-r from-yellow-500 to-green-500 text-gray-900 shadow-lg'
                                    : 'bg-gradient-to-r from-yellow-400 to-green-400 text-gray-900'
                            }
                            `}
                        >
                            S'inscrire
                        </NavLink>
                    </div>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`md:hidden transition-colors ${scrolled ? 'text-gray-800' : 'text-white'}`}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                <div className={`md:hidden transition-all duration-500 overflow-hidden ${
                    isOpen ? 'max-h-96 mt-4' : 'max-h-0'
                }`}>
                    <div className="bg-white/95 backdrop-blur-md rounded-lg p-4 space-y-3">
                        <Link
                            to="home"
                            smooth={true}
                            duration={500}
                            offset={-70}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-blue-600 rounded-lg transition-all duration-300"
                        >
                            Accueil
                        </Link>
                        <Link
                            to="about"
                            smooth={true}
                            duration={500}
                            offset={-70}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-blue-600 rounded-lg transition-all duration-300"
                        >
                            À propos
                        </Link>
                        <Link
                            to="contacts"
                            smooth={true}
                            duration={500}
                            offset={-70}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-blue-600 rounded-lg transition-all duration-300"
                        >
                            Contacts
                        </Link>
                        <hr className="border-gray-200" />
                        <NavLink
                            to="/login"
                            onClick={() => setIsOpen(false)}
                            className="block w-full px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-all duration-300"
                        >
                            Se connecter
                        </NavLink>
                        <NavLink
                            to="/signup"
                            onClick={() => setIsOpen(false)}
                            className="block w-full px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-center"
                        >
                            S'inscrire
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav;