
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
    const location = useLocation();
    const navLinkClasses = "font-semibold text-gray-600 hover:text-brand-primary transition-colors pb-1 border-b-2";
    const activeLinkClasses = "text-brand-primary border-brand-primary";
    const inactiveLinkClasses = "border-transparent";

    return (
        <header className="bg-gray-100/80 backdrop-blur-lg z-40 shadow-sm border-b border-gray-200 sticky top-0">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-gray-800">
                    AI Resume Architect
                </Link>
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        to="/"
                        className={`${navLinkClasses} ${location.pathname === '/' ? activeLinkClasses : inactiveLinkClasses}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/templates"
                        className={`${navLinkClasses} ${location.pathname.startsWith('/templates') ? activeLinkClasses : inactiveLinkClasses}`}
                    >
                        Templates
                    </Link>
                    <Link
                        to="/editor"
                        className={`${navLinkClasses} ${location.pathname.startsWith('/editor') ? activeLinkClasses : inactiveLinkClasses}`}
                    >
                        Editor
                    </Link>
                </div>
                {/* A placeholder for mobile menu for responsiveness */}
                <div className="md:hidden">
                     <button aria-label="Open menu" className="text-gray-800 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;
