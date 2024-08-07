import React, { useState } from 'react';
import { FaHome, FaBookReader, FaRegCalendarTimes } from 'react-icons/fa';
import { TbBooks } from "react-icons/tb";
import { Link, useLocation } from 'react-router-dom';
import { HiUserAdd } from "react-icons/hi";
import { BiSolidBookAdd } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";

const Menu = () => {
    const [sidebar, setSidebar] = useState(false);
    const location = useLocation();

    const menuItems = [
        { to: '/', label: 'Strona główna', icon: <FaHome /> },
        { to: '/readers', label: 'Czytelnicy', icon: <FaBookReader /> },
        { to: '/reader/add', label: 'Nowy czytelnik', icon: <HiUserAdd /> },
        { to: '/books', label: 'Ksiegozbiór', icon: <TbBooks /> },
        { to: '/book/add', label: 'Nowa książka', icon: <BiSolidBookAdd /> },
        { to: '/search', label: 'Wyszukiwanie', icon: <CiSearch /> },
        { to: '/delays', label: 'Zaległości', icon: <FaRegCalendarTimes /> },
    ];

    return (
        <aside
            id="sidebar-menu"
            aria-expanded={sidebar}
            className={`fixed transition-all duration-500 ease-in-out h-screen bg-white bg-cover bg-[url('https://wallpapers.com/images/hd/minimalist-phone-1440-x-2560-background-l50nd91jwe8kergc.jpg')] shadow-sm w-64 ${sidebar ? 'w-64 md:-ms-64' : 'w-64 -ms-64 md:ms-0'} `}
        >
            <div className="h-full overflow-y-auto scrollbars">
                {/* Logo */}
                <div className="text-center p-5">
                    <a href="#" className="relative">
                        <img className="h-12 w-auto" src="/img/workflow-mark-indigo-600.svg" alt="Workflow" />
                        <h2 className="text-3xl font-semibold mx-auto logo-compact hidden">Taildash</h2>
                    </a>
                </div>

                {/* Sidebar menu */}
                <ul id="side-menu" className="w-full float-none font-medium">
                    {menuItems.map((item) => (
                        <li
                            key={item.to}
                            className={`relative hover:text-white hover:bg-red-400 text-white ${location.pathname === item.to ? 'text-white-100 bg-red-500 hover:text-white hover:bg-red-400 focus:bg-red-400 focus:outline-none' : ''}`}
                        >
                            <Link to={item.to} className={`block py-2.5 px-6 text-white hover:text-white-500`}>
                                <span className="flex items-center gap-3">
                                    {item.icon} {item.label}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Menu;
