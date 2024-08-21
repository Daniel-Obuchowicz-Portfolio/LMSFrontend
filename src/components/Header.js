import React from 'react';
import { FaHome, FaBookReader, FaRegCalendarTimes } from 'react-icons/fa';
import { TbBooks } from "react-icons/tb";
import { Link, useLocation } from 'react-router-dom';
import { HiUserAdd } from "react-icons/hi";
import { BiSolidBookAdd } from "react-icons/bi";
import { CiSearch } from "react-icons/ci";
import { IoSettingsSharp } from "react-icons/io5";
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

const Menu = ({ sidebar, toggleSidebar, sidebarRef }) => {
    const location = useLocation();
    const { t, i18n } = useTranslation(); // Initialize the useTranslation hook

    const menuItems = [
        { to: '/', label: t('Home'), icon: <FaHome /> },
        { to: '/readers', label: t('Readers'), icon: <FaBookReader /> },
        { to: '/reader/add', label: t('Add Reader'), icon: <HiUserAdd /> },
        { to: '/books', label: t('Library'), icon: <TbBooks /> },
        { to: '/book/add', label: t('Add Book'), icon: <BiSolidBookAdd /> },
        { to: '/search', label: t('Search'), icon: <CiSearch /> },
        { to: '/delays', label: t('Delays'), icon: <FaRegCalendarTimes /> },
        { to: '/settings', label: t('Settings'), icon: <IoSettingsSharp /> },
    ];

    

    return (
        <aside
            ref={sidebarRef}
            id="sidebar-menu"
            className={`fixed transition-transform duration-300 ease-in-out h-screen bg-white bg-cover bg-[url('https://wallpapers.com/images/hd/minimalist-phone-1440-x-2560-background-l50nd91jwe8kergc.jpg')] shadow-sm w-64 z-50 transform ${sidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        >
            <div className="h-full overflow-y-auto scrollbars">
                {/* Logo */}
                <div className="text-center p-5">
                    <button className="relative focus:outline-none">
                        <img className="h-12 w-auto" src="/img/workflow-mark-indigo-600.svg" alt="Workflow" />
                        <h2 className="text-3xl font-semibold mx-auto logo-compact hidden">Taildash</h2>
                    </button>
                </div>

                {/* Sidebar menu */}
                <ul id="side-menu" className="w-full float-none font-medium">
                    {menuItems.map((item) => (
                        <li
                            key={item.to}
                            className={`relative hover:text-white hover:bg-red-400 text-white ${location.pathname === item.to ? 'text-white-100 bg-red-500 hover:text-white hover:bg-red-400 focus:bg-red-400 focus:outline-none' : ''}`}
                        >
                            <Link to={item.to} className={`block py-2.5 px-6 text-white hover:text-white-500`} onClick={toggleSidebar}>
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
