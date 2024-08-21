import React, { useEffect, useRef, useState } from 'react';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa'; // Import FaBars and FaTimes for the hamburger and close icons
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserData } from './userSlice';

const TopHeader = ({ toggleSidebar, isSidebarOpen }) => { // Accept toggleSidebar and isSidebarOpen as props
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const userStatus = useSelector((state) => state.user.status);

    const [searchQuery, setSearchQuery] = useState('');
    const [isMoreOptionsOpen, setIsMoreOptionsOpen] = useState(false);

    const wrapperRef = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== '') {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    useEffect(() => {
        if (userStatus === 'idle') {
            dispatch(fetchUserData());
        }
    }, [userStatus, dispatch]);

    useEffect(() => {
        if (userStatus === 'succeeded' && !user) {
            navigate('/login');
        }
    }, [user, userStatus, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('id');
        localStorage.removeItem('token');
        localStorage.removeItem('recentSearches');
        navigate('/login');
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsMoreOptionsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    if (!user) return null;

    const getDropdownClass = () => {
        return "absolute bg-white dark:bg-gray-700 dark:text-white shadow-md mt-2 rounded-lg py-1 mr-[22px] mt-[30px] z-[99] " +
            (window.innerWidth < 768 ? "left-0" : "right-0");
    };
    

    return (
        <div className="flex justify-between items-center p-4 px-6 bg-white dark:bg-primary" ref={wrapperRef}>
            <img className="flex md:hidden h-12 w-auto" src="/img/workflow-mark-indigo-600.svg" alt="Workflow" />
            <div className="hidden md:flex items-center space-x-4">
                <div className="relative flex items-center">
                    <form onSubmit={handleSearch} className="flex">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white pr-10"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                            <FaSearch />
                        </button>
                    </form>
                </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
                <div className="hidden lg:flex items-center space-x-4">
                    <img src={user.profile_picture || '/img/profile-icon-design.jpg'} alt="Profile" className="w-10 h-10 object-cover rounded-full" />
                    <div>
                        <h2 className="text-sm font-semibold dark:text-white">{user.first_name} {user.last_name}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">General Practitioner</p>
                    </div>
                    <div className="flex items-center space-x-[12px]">
                        <div className="border-l h-6 dark:border-gray-600"></div>
                        <div className="flex gap-[12px]">
                            {/* Redirect to settings */}
                            <button onClick={() => navigate('/settings')}>
                                <img src="/img/settings_FILL0_wght300_GRAD0_opsz24.svg" alt="Settings" className="h-[20px] dark:invert" />
                            </button>

                            <button onClick={() => { setIsMoreOptionsOpen(!isMoreOptionsOpen); }}>
                                <img src="/img/more_vert_FILL0_wght300_GRAD0_opsz24.svg" alt="More options" className="h-[18px] dark:invert" />
                            </button>
                            {isMoreOptionsOpen && (
                                <ul className={getDropdownClass()}>
                                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer" onClick={handleLogout}>Log Out</li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Hamburger menu button, visible on small screens */}
            <div className="lg:hidden flex items-center">
                <button onClick={toggleSidebar} className="text-gray-600 dark:text-white">
                    {isSidebarOpen ? <FaTimes className="text-4xl" /> : <FaBars className="text-4xl" />}
                </button>
            </div>
        </div>
    );
};

export default TopHeader;
