import React, { useEffect, useState, useRef } from 'react';
import { FaBars, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserData } from './userSlice';
import { useDarkMode } from '../components/DarkModeContext'; // Assuming you have a DarkModeContext

const TopHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const userStatus = useSelector((state) => state.user.status);

    const { isDarkMode, toggleDarkMode } = useDarkMode(); // Use dark mode context
    const [searchQuery, setSearchQuery] = useState('');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
                setIsSettingsOpen(false);
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
            <div className="flex items-center space-x-4">
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
            <div className="flex items-center space-x-6">
                <div className="hidden lg:flex items-center space-x-4">
                    <img src={user.profile_picture || '/img/profile-icon-design.jpg'} alt="Profile" className="w-10 h-10 object-cover rounded-full" />
                    <div>
                        <h2 className="text-sm font-semibold dark:text-white">{user.first_name} {user.last_name}</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">General Practitioner</p>
                    </div>
                    <div className="flex items-center space-x-[12px]">
                        <div className="border-l h-6 dark:border-gray-600"></div>
                        <div className="flex gap-[12px]">
                            <button onClick={() => { setIsSettingsOpen(!isSettingsOpen); setIsMoreOptionsOpen(false); }}><img src="/img/settings_FILL0_wght300_GRAD0_opsz24.svg" alt="Settings" className="h-[20px] dark:invert" /></button>
                            {isSettingsOpen && (
                                <ul className={getDropdownClass()}>
                                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">Change Language</li>
                                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer" onClick={toggleDarkMode}>
                                        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                    </li>
                                </ul>
                            )}

                            <button onClick={() => { setIsMoreOptionsOpen(!isMoreOptionsOpen); setIsSettingsOpen(false); }}><img src="/img/more_vert_FILL0_wght300_GRAD0_opsz24.svg" alt="More options" className="h-[18px] dark:invert" /></button>
                            {isMoreOptionsOpen && (
                                <ul className={getDropdownClass()}>
                                    <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer" onClick={handleLogout}>Log Out</li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopHeader;
