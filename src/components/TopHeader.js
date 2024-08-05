// src/components/TopHeader.js
import React, { useEffect, useState } from 'react';
import { FaBars, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserData } from './userSlice';

const TopHeader = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const userStatus = useSelector((state) => state.user.status);

    const [searchQuery, setSearchQuery] = useState('');

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
      if (!user) {
        navigate('/login'); // Redirect to the login page if user is not authenticated
      }
    }, [user, navigate]);
  
    if (!user) return null;

    return (
        <div className="flex justify-between items-center p-4 bg-white">
            <div className="flex items-center space-x-4">
                <FaBars className="text-gray-700 text-2xl cursor-pointer" />
                <div className="relative flex items-center">
                <form onSubmit={handleSearch} className="flex">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="px-4 py-2 rounded-lg border border-gray-300 pr-10"
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
