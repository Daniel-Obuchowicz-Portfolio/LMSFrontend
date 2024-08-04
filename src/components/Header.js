import React, { useState } from 'react';
import { FaHome, FaBookReader } from 'react-icons/fa';
import { TbBooks } from "react-icons/tb";
import { Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { HiUserAdd } from "react-icons/hi";
import { BiSolidBookAdd } from "react-icons/bi";



const Menu = () => {
    const [sidebar, setSidebar] = useState(false);
    const [selected, setSelected] = useState(false);
    return (


        <aside id="sidebar-menu" aria-expanded={sidebar} className={`fixed transition-all duration-500 ease-in-out h-screen bg-white bg-cover bg-[url('https://wallpapers.com/images/hd/minimalist-phone-1440-x-2560-background-l50nd91jwe8kergc.jpg')]  shadow-sm w-64 ${sidebar ? 'w-64 md:-ms-64' : 'w-64 -ms-64 md:ms-0'} `}>
            <div className="h-full overflow-y-auto scrollbars">
                {/* Logo */}
                <div className="text-center p-5">
                    <a href="#" className="relative">
                        <img className="h-12 w-auto" src="/img/workflow-mark-indigo-600.svg" alt="Workflow" />
                        <h2 className="text-3xl font-semibold mx-auto logo-compact hidden">
                            Taildash
                        </h2>
                    </a>
                </div>

                {/* Sidebar menu */}
                <ul
                    id="side-menu"
                    className="w-full float-none font-medium"
                >


                    <li className="relative text-white">
                        <Link to={`/`} className="block py-2.5 px-6 text-white hover:text-indigo-500 dark:hover:text-indigo-400">
                            <span className="flex items-center gap-3"> <FaHome/> Strona główna</span>
                        </Link>
                    </li>
                    <li className="relative text-white">
                        <Link to={`/readers`} className="block py-2.5 px-6 text-white hover:text-indigo-500 dark:hover:text-indigo-400">
                            <span className="flex items-center gap-3"> <FaBookReader /> Czytelnicy</span>
                        </Link>
                    </li>
                    <li className="relative text-white">
                        <Link to={`/reader/add`} className="block py-2.5 px-6 text-white hover:text-indigo-500 dark:hover:text-indigo-400">
                            <span className="flex items-center gap-3"> <HiUserAdd />
                            Nowy czytelnik</span>
                        </Link>
                    </li>
                    <li className="relative text-white">
                        <Link to={`/books`} className="block py-2.5 px-6 text-white hover:text-indigo-500 dark:hover:text-indigo-400">
                            <span className="flex items-center gap-3"> <TbBooks /> Ksiegozbiór</span>
                        </Link>
                    </li>
                    <li className="relative text-white">
                        <Link to={`/book/add`} className="block py-2.5 px-6 text-white hover:text-indigo-500 dark:hover:text-indigo-400">
                            <span className="flex items-center gap-3"> <BiSolidBookAdd /> Nowa książka</span>
                        </Link>
                    </li>

                    {/* More dropdowns similar to the one above */}
                </ul>

            </div>
        </aside >
    );
};

export default Menu;