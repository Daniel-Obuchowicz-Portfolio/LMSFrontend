import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import Swal from 'sweetalert2';
import { IoIosArrowBack } from "react-icons/io";
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const ReaderAdd = () => {
  const { t } = useTranslation('readers'); // Użyj namespace 'readers'
  const [user, setUser] = useState({ is_active: true });
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarRef]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUser((prevUser) => ({ ...prevUser, profile_picture: URL.createObjectURL(file) }));
      setFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const updatedUser = { ...user, profile_picture_p: reader.result };
        await submitUserData(updatedUser, token);
      };
      reader.onerror = error => console.log('Error: ', error);
    } else {
      await submitUserData(user, token);
    }
  };

  const submitUserData = async (userData, token) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: t('Success'),
        text: t('User registered successfully'),
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: t('Error'),
        text: t('Failed to register user'),
      });
    }
  };

  return (
    <div className="min-h-screen flex font-montserrat bg-[#f6f5ff] dark:bg-gray-800 dark:text-white">
      <Menu sidebar={sidebarOpen} toggleSidebar={toggleSidebar} sidebarRef={sidebarRef} />
      <main className="flex-1 xl:pl-[16rem]">
        <TopHeader toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <div className="p-6 min-h-[84.2vh]">
          <div className="md:flex items-center mb-6 gap-4">
            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex gap-2 items-center text-sm md:text-base mb-4 md:mb-0"
              onClick={() => navigate(-1)}
            >
              <IoIosArrowBack /> {t('Back')}
            </button>
            <h1 className="text-xl font-bold">{t('Add New Reader')}</h1>
          </div>
          <div className="md:flex">
            <div className="md:w-2/5 bg-white dark:bg-primary shadow-md rounded p-6 h-fit">
              <div className="flex flex-col items-center mb-4">
                <div className='w-[140px] h-[140px] rounded-full bg-[#ffffff] dark:bg-gray-700 mx-auto border-4 border-[#ef4444] mb-5'>
                  <img className="w-[132px] h-[132px] rounded-full mb-4 object-cover" src={user?.profile_picture || '/img/profile-icon-design.jpg'} alt={`${user?.first_name} ${user?.last_name}`} />
                </div>
                <h3 className="text-xl font-bold">{user?.first_name} {user?.last_name}</h3>
                <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
              </div>
            </div>
            <div className="md:w-3/5 bg-white dark:bg-primary shadow-md rounded p-8 md:ml-4 mt-4 md:mt-0">
              <div className="mx-auto">
                <h2 className="text-2xl font-bold mb-4">{t('Edit Information')}</h2>
                <form onSubmit={handleSubmit}>
                  <input type="hidden" name="is_active" value={user.is_active} onChange={handleInputChange} />
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('First Name')}</label>
                    <input
                      type="text"
                      name="first_name"
                      value={user?.first_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Last Name')}</label>
                    <input
                      type="text"
                      name="last_name"
                      value={user?.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={user?.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Phone Number')}</label>
                    <input
                      type="text"
                      name="phone_number"
                      value={user?.phone_number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Address')}</label>
                    <input
                      type="text"
                      name="address"
                      value={user?.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Date of Birth')}</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={user?.date_of_birth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Gender')}</label>
                    <select
                      name="gender"
                      value={user?.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    >
                      <option value="male">{t('Male')}</option>
                      <option value="female">{t('Female')}</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Password')}</label>
                    <input
                      type="password"
                      name="password"
                      value={user?.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Profile Picture')}</label>
                    <input
                      name='profile_picture_p'
                      type="file"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>
                  <button type="submit" className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                    {t('Save')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default ReaderAdd;
