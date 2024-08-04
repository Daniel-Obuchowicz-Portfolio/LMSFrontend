// src/components/TopHeader.js
import React, { useEffect } from 'react';
import { FaBars, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from './userSlice';

const TopHeader = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    const userStatus = useSelector((state) => state.user.status);

    useEffect(() => {
        if (userStatus === 'idle') {
            dispatch(fetchUserData());
        }
    }, [userStatus, dispatch]);

    if (!user) return null; // Możesz również dodać loader lub inny placeholder

    return (
        <div className="flex justify-between items-center p-4 bg-white">
            <div className="flex items-center space-x-4">
                <FaBars className="text-gray-700 text-2xl cursor-pointer" />
                <div className="relative flex items-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="px-4 py-2 rounded-lg border border-gray-300 pr-10"
                    />
                    <FaSearch className="absolute right-3 text-gray-400" />
                </div>
            </div>
            <div className="flex items-center space-x-6">
                <div className="hidden lg:flex items-center space-x-4">
                    <img src={user.profile_picture || '/img/profile-icon-design.jpg'} alt="Profile" className="w-10 h-10 object-cover rounded-full" />
                    <div>
                        <h2 className="text-sm font-semibold">{user.first_name} {user.last_name}</h2>
                        <p className="text-xs text-gray-500">General Practitioner</p>
                    </div>
                    <div className="flex items-center space-x-[12px]">
                        <div className="border-l h-6"></div>
                        <div className="flex gap-[12px]">
                            <img src="/img/settings_FILL0_wght300_GRAD0_opsz24.svg" alt="Settings" className="h-[20px]" />
                            <img src="/img/more_vert_FILL0_wght300_GRAD0_opsz24.svg" alt="More options" className="h-[18px]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopHeader;
