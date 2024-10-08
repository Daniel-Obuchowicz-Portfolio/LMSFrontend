import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import Swal from 'sweetalert2';
import { IoIosArrowBack } from "react-icons/io";
import { MdArrowForwardIos } from "react-icons/md";
import { FaInfoCircle } from 'react-icons/fa';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const Readerdetails = () => {
  const { t } = useTranslation('readerdetails');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null); // Reference to the sidebar element

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false); // Close sidebar if click outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarRef]);

  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [borrowings, setBorrowings] = useState([]);
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        Swal.fire({
          icon: 'error',
          title: t('Error'),
          text: t('Failed to fetch user data'),
        });
      }
      // setIsLoading(false);
    };

    const fetchBorrowings = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/borrowings/5/user/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBorrowings(data);
      } else {
        Swal.fire({
          icon: 'error',
          title: t('Error'),
          text: t('Failed to fetch borrowings data'),
        });
      }
    };

    fetchUser();
    fetchBorrowings();
  }, [id, t]);

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

    let updatedUser = { ...user };

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        updatedUser.profile_picture_p = reader.result;

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${id}/put`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedUser)
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: t('Success'),
            text: t('User updated successfully'),
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: t('Error'),
            text: t('Failed to update user'),
          });
        }
      };
      reader.onerror = error => console.log('Error: ', error);
    }
    else {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${id}/put`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      });

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: t('Success'),
          text: t('User updated successfully'),
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: t('Error'),
          text: t('Failed to update user'),
        });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-montserrat bg-[#f6f5ff] dark:bg-gray-800">
      <Menu sidebar={sidebarOpen} toggleSidebar={toggleSidebar} sidebarRef={sidebarRef} />
      <main className="flex-1 xl:pl-[16rem]">
        <TopHeader toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <div className="p-6 min-h-[84.2vh]">
          <div className="xl:flex items-center mb-6 gap-4">
            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex gap-2 items-center text-sm xl:text-base mb-4 xl:mb-0"
              onClick={() => navigate(-1)}
            >
              <IoIosArrowBack /> {t('Back')}
            </button>
            <h1 className="text-lg xl:text-xl font-bold text-gray-900 dark:text-white">{t('Edit Reader')}</h1>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/5 flex flex-col gap-6">
              <div className="bg-white dark:bg-primary shadow-md rounded p-4 xl:p-6">
                <div className="flex flex-col items-center mb-4">
                  <div className='w-[140px] h-[140px] rounded-full bg-[#ffffff] dark:bg-gray-900 mx-auto border-4 border-[#ef4444] mb-5'>
                    <img
                      className="w-[132px] h-[132px] rounded-full object-cover"
                      src={user?.profile_picture || '/img/profile-icon-design.jpg'}
                      alt={`${user?.first_name} ${user?.last_name}`}
                    />
                  </div>
                  <h3 className="text-lg xl:text-xl font-bold text-gray-900 dark:text-white">{user?.first_name} {user?.last_name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</p>
                </div>
              </div>
              <div className="bg-white dark:bg-primary shadow-md rounded p-4 xl:p-6">
                <div className="xl:flex justify-between items-center mb-4">
                  <h2 className="text-lg xl:text-2xl font-bold text-gray-900 dark:text-white mb-4 xl:mb-0">{t('Recent Borrowings')}</h2>
                  <Link
                    to={`/readerdetails/${user?.id}/borrowings`}
                    className="items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none"
                  >
                    {t('View All')} <MdArrowForwardIos />
                  </Link>
                </div>
                {borrowings.length === 0 ? (
                  <div className="flex items-center justify-center text-gray-500 dark:text-gray-400 mt-8">
                    <FaInfoCircle className="mr-2" />
                    <span>{t('No data available')}</span>
                  </div>
                ) : (
                  borrowings.map((borrowing) => (
                    <div key={borrowing.id} className="flex flex-col xl:flex-row mb-4 p-4 border rounded dark:border-gray-700">
                      <div className="xl:w-1/12 flex justify-center xl:justify-start mb-4 xl:mb-0">
                        <img
                          className="w-[10vh] xl:w-full object-cover"
                          src={borrowing.book.coverImage || '/img/blank-book-cover-over-png.png'}
                          alt={borrowing.book.title}
                        />
                      </div>
                      <div className="xl:w-11/12 xl:pl-4">
                        <h2 className="font-bold text-lg xl:text-2xl mb-3 text-gray-900 dark:text-white">{borrowing.book.title}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{t('Author')}: <strong>{borrowing.book.author}</strong></p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="lg:w-3/5 bg-white dark:bg-primary shadow-md rounded p-4 xl:p-8">
              <div className="mx-auto">
                <h2 className="text-lg xl:text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t('Edit Information')}</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('First Name')}</label>
                    <input
                      type="text"
                      name="first_name"
                      value={user?.first_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Last Name')}</label>
                    <input
                      type="text"
                      name="last_name"
                      value={user?.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={user?.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Phone Number')}</label>
                    <input
                      type="text"
                      name="phone_number"
                      value={user?.phone_number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Address')}</label>
                    <input
                      type="text"
                      name="address"
                      value={user?.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Date of Birth')}</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={user?.date_of_birth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Gender')}</label>
                    <select
                      name="gender"
                      value={user?.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    >
                      <option value="male">{t('Male')}</option>
                      <option value="female">{t('Female')}</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300">{t('Profile Picture')}</label>
                    <input
                      name='profile_picture_p'
                      type="file"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-900"
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

export default Readerdetails;
