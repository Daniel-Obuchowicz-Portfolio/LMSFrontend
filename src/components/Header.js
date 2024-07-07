import React, { useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { Transition } from '@headlessui/react';

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
                    {/* Dropdown */}
                    <li className="relative text-white">
                        <a
                            className={`block py-2.5 px-6 ${selected === 1 ? 'text-indigo-500 dark:text-indigo-400' : ''
                                } hover:text-indigo-500 dark:hover:text-indigo-400`}
                            href="javascript:;"
                            onClick={() => setSelected(selected !== 1 ? 1 : null)}
                        >
                            <div className="flex items-center justify-between">
                                <div>

                                    <span className="flex items-center gap-3"> <FaHome className="" /> Dashboards</span>
                                </div>
                                {/* Caret */}
                                <span className="inline-block float-end">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        className={`transform transition duration-300 ${selected === 1 ? 'rotate-0' : 'ltr:-rotate-90 rtl:rotate-90'
                                            }`}
                                        width=".8rem"
                                        height=".8rem"
                                        viewBox="0 0 16 16"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                                        ></path>
                                    </svg>
                                </span>
                            </div>

                        </a>
                        {/* Dropdown menu */}
                        <Transition
                            show={selected === 1}
                            enter="transition-all duration-200 ease-out"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            className="block rounded rounded-t-none top-full z-50 py-0.5 text-start mb-1 font-normal bg-[#0000004a]"
                        >
                            <ul>
                                <li className="relative">
                                    <a
                                        className="active block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500 dark:hover:text-indigo-400"
                                        href="index.html"
                                    >
                                        CMS
                                    </a>
                                </li>
                                <li className="relative">
                                    <a
                                        className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500 dark:hover:text-indigo-400"
                                        href="index-analytics.html"
                                    >
                                        Analytics
                                    </a>
                                </li>
                                <li className="relative">
                                    <a
                                        className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500 dark:hover:text-indigo-400"
                                        href="index-ecommerce.html"
                                    >
                                        Ecommerce
                                    </a>
                                </li>
                                <li className="relative">
                                    <a
                                        className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500 dark:hover:text-indigo-400"
                                        href="index-projects.html"
                                    >
                                        Projects
                                    </a>
                                </li>
                                <li className="relative">
                                    <a
                                        className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500 dark:hover:text-indigo-400"
                                        href="index-crm.html"
                                    >
                                        CRM
                                    </a>
                                </li>
                                <li className="relative">
                                    <a
                                        className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500 dark:hover:text-indigo-400"
                                        href="index-hosting.html"
                                    >
                                        Hosting
                                    </a>
                                </li>
                                <li className="relative">
                                    <a
                                        className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500 dark:hover:text-indigo-400"
                                        href="index-saas.html"
                                    >
                                        Saas
                                    </a>
                                </li>
                                <li className="relative">
                                    <a
                                        className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500 dark:hover:text-indigo-400"
                                        href="index-sales.html"
                                    >
                                        Sales
                                    </a>
                                </li>
                                <li className="relative">
                                    <a
                                        className="block w-full py-2 px-6 clear-both whitespace-nowrap hover:text-indigo-500 dark:hover:text-indigo-400"
                                        href="index-marketing.html"
                                    >
                                        Marketing
                                    </a>
                                </li>
                            </ul>
                        </Transition>
                    </li>

                    <li>
                        <a
                            className="block py-2.5 px-6 text-white hover:text-indigo-500 dark:hover:text-indigo-400"
                            href="calendar.html"
                        >
                            <span>Calendar</span>
                        </a>
                    </li>

                    {/* More dropdowns similar to the one above */}
                </ul>

                {/* Banner */}
                <div className="px-4 box-banner">
                    <div className="my-8 p-4 text-center bg-white rounded-lg">
                        <h4 className="font-bold inline-block mb-2">Sales Report</h4>
                        <div className="mb-3 text-sm">
                            Monthly sales report is ready for download!
                        </div>
                        <div className="grid">
                            <a
                                href="landing.html"
                                className="py-2 px-4 inline-block text-center mb-3 rounded leading-5 text-gray-100 bg-pink-500 border border-pink-500 hover:text-white hover:bg-pink-600 focus:bg-pink-600 focus:outline-none"
                            >
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </aside >
    );
};

export default Menu;