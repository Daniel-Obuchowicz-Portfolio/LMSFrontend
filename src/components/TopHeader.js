import React, { useEffect, useState } from 'react';
import { FaBars, FaSearch, FaHome } from 'react-icons/fa';
import { redirect } from 'react-router-dom';


const TopHeader = () => {
    const [user, setUser] = useState({
        id: '',
        email: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        phone_number: '',
        address: '',
        profile_picture: '',
        is_active: false,
        created_at: '',
        updated_at: ''
    });

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if(response.status === 401){
                    
                    return redirect("/login");
                    
                }

                if (response.ok) {
                    const data = await response.json();
                    setUser({
                        id: data.id,
                        email: data.email,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        date_of_birth: data.date_of_birth,
                        gender: data.gender,
                        phone_number: data.phone_number,
                        address: data.address,
                        profile_picture: data.profile_picture,
                        is_active: data.is_active,
                        created_at: data.created_at,
                        updated_at: data.updated_at
                    });
                } else {
                    console.error(response);
                    
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);
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
                <div class="hidden lg:flex items-center space-x-4">
                    <img src={user?.profile_picture || '/img/profile-icon-design.jpg'} alt="Dr. Jose Simmons" class="w-10 h-10 object-cover rounded-full" /><div>
                        <h2 class="text-sm font-semibold">{user.first_name} {user.last_name}</h2>
                        <p class="text-xs text-gray-500">General Practitioner</p></div>
                    <div class="flex items-center space-x-[12px]">
                        <div class="border-l h-6"></div>
                        <div class="flex gap-[12px]">
                            <img src="/img/settings_FILL0_wght300_GRAD0_opsz24.svg" alt="Settings" class="h-[20px]" />
                            <img src="/img/more_vert_FILL0_wght300_GRAD0_opsz24.svg" alt="Three dots" class="h-[18px]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default TopHeader;