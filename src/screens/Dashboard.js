import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { MdArrowForwardIos } from "react-icons/md";
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Skeleton = ({ width, height }) => (
  <div style={{ width, height, backgroundColor: '#e0e0e0' }} className="rounded animate-pulse m-3 mx-0"></div>
);

const StatsChart = ({ borrowData, readersData, title }) => {
  const { t } = useTranslation(); // Access translation
  const prefersDarkMode = document.documentElement.classList.contains('dark');
  const data = {
    labels: [
      t('January'),
      t('February'),
      t('March'),
      t('April'),
      t('May'),
      t('June'),
      t('July'),
      t('August'),
      t('September'),
      t('October'),
      t('November'),
      t('December'),
    ],
    datasets: [
      {
        label: t('Borrowings'),
        data: borrowData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        fill: false,
      },
      {
        label: t('New Readers'),
        data: readersData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: prefersDarkMode ? '#fff' : '#000', // Adjust color based on dark mode
        },
      },
      title: {
        display: true,
        text: title,
        color: prefersDarkMode ? '#fff' : '#000', // Adjust color based on dark mode
      },
    },
    scales: {
      x: {
        ticks: {
          color: prefersDarkMode ? '#fff' : '#000', // Adjust color based on dark mode
        },
        grid: {
          color: prefersDarkMode ? '#444' : '#ccc', // Adjust grid color for better visibility
        },
      },
      y: {
        ticks: {
          color: prefersDarkMode ? '#fff' : '#000', // Adjust color based on dark mode
        },
        grid: {
          color: prefersDarkMode ? '#444' : '#ccc', // Adjust grid color for better visibility
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

const Dashboard = () => {
  const { t } = useTranslation('dashboard'); // Access translation
  const [borrowData, setBorrowData] = useState([]);
  const [readersData, setReadersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchBorrowData = async () => {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/borrowingsmonthly`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBorrowData(data);
      } else {
        console.error('Failed to fetch borrow data');
      }
      setIsLoading(false);
    };

    fetchBorrowData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchReadersData = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/usersmonthly`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReadersData(data);
      } else {
        console.error('Failed to fetch readers data');
      }
    };

    fetchReadersData();
  }, []);

  useEffect(() => {
    const fetchOverdueBooks = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/filteredBorrowingsfive`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOverdueBooks(data);
      } else {
        console.error('Failed to fetch overdue books data');
      }
    };

    fetchOverdueBooks();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/fiveusers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch user data');
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/fivebooks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      } else {
        console.error('Failed to fetch book data');
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchBookCount = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/count/books`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBookCount(data.count);
      } else {
        console.error('Failed to fetch book count data');
      }
    };

    const fetchUserCount = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/count/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserCount(data.count);
      } else {
        console.error('Failed to fetch user count data');
      }
    };

    fetchBookCount();
    fetchUserCount();
  }, []);

  return (
    <div className="min-h-screen flex font-montserrat bg-[#f6f5ff] dark:bg-gray-800">
      <Menu sidebar={sidebarOpen} toggleSidebar={toggleSidebar} sidebarRef={sidebarRef} />
      <main className="flex-1 xl:pl-[16rem]">
        <TopHeader toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <div className="p-6 min-h-[84.2vh]">
          <div className="flex justify-left items-center mb-4 gap-4 items-center">
            <h1 className="text-xl font-bold dark:text-white">{t('Dashboard')}</h1>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-primary p-4 rounded-lg shadow-md">
              {isLoading ? (
                <Skeleton width="100%" height="80px" />
              ) : (
                <div className="flex justify-between items-center gap-5">
                  <img src="/img/reader_4213477.png" alt="Settings" className="w-[15%] dark:invert" />
                  <div className="w-[85%]">
                    <h2 className="text-xl font-semibold dark:text-white">{t('Total Readers')}</h2>
                    <p className="text-2xl mt-2 dark:text-gray-300">{userCount}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-primary p-4 rounded-lg shadow-md h-auto">
              {isLoading ? (
                <Skeleton width="100%" height="80px" />
              ) : (
                <div className="flex justify-between items-center gap-5">
                  <img src="/img/book_4213400.png" alt="Settings" className="w-[15%] dark:invert" />
                  <div className="w-[85%]">
                    <h2 className="text-xl font-semibold dark:text-white">{t('Total Books')}</h2>
                    <p className="text-2xl mt-2 dark:text-gray-300">{bookCount}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-primary p-4 rounded-lg shadow-md">
              {isLoading ? (
                <Skeleton width="100%" height="80px" />
              ) : (
                <div className="flex justify-between items-center gap-5">
                  <img src="/img/book_4213426.png" alt="Settings" className="w-[15%] dark:invert" />
                  <div className="w-[85%]">
                    <h2 className="text-xl font-semibold dark:text-white">{t('Total Borrowings')}</h2>
                    <p className="text-2xl mt-2 dark:text-gray-300">{bookCount}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Charts and Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white dark:bg-primary p-4 rounded-lg shadow-md">
              <div className="xl:flex justify-between items-center">
                <h2 className="font-semibold text-2xl dark:text-white mb-4 xl:mb-0">{t('New Readers')}</h2>
                <Link
                  to="/readers"
                  className="items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none w-fit"
                >
                  {t('View All')} <MdArrowForwardIos />
                </Link>
              </div>
              {isLoading ? (
                <Skeleton width="100%" height="200px" />
              ) : (
                <div className="p-3 px-0">
                  {/* Responsive Table Container */}
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max table-auto text-left font-montserrat">
                      <thead className="text-xs font-semibold uppercase bg-gray-50 dark:bg-gray-700 rounded">
                        <tr>
                          <th className="border-blue-gray-100 bg-blue-gray-50/50 dark:bg-gray-700 p-4">
                            <p className="block antialiased font-sans text-sm text-blue-gray-900 dark:text-gray-300 font-normal leading-none opacity-70">
                              {t('Reader')}
                            </p>
                          </th>
                          <th className="border-blue-gray-100 bg-blue-gray-50/50 dark:bg-gray-700 p-4">
                            <p className="block antialiased font-sans text-sm text-blue-gray-900 dark:text-gray-300 font-normal leading-none opacity-70">
                              {t('Email')}
                            </p>
                          </th>
                          <th className="border-blue-gray-100 bg-blue-gray-50/50 dark:bg-gray-700 p-4">
                            <p className="block antialiased font-sans text-sm text-blue-gray-900 dark:text-gray-300 font-normal leading-none opacity-70">
                              {t('Phone')}
                            </p>
                          </th>
                          <th className="border-blue-gray-100 bg-blue-gray-50/50 dark:bg-gray-700 p-4">
                            <p className="block antialiased font-sans text-sm text-blue-gray-900 dark:text-gray-300 font-normal leading-none opacity-70">
                              {t('Active')}
                            </p>
                          </th>
                          <th className="border-blue-gray-100 bg-blue-gray-50/50 dark:bg-gray-700 p-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="p-2">
                              <div className="flex items-center gap-3">
                                <img
                                  src={user.profile_picture}
                                  alt={`${user.first_name}'s profile`}
                                  className="inline-block relative object-center !rounded-full w-12 h-12 rounded-lg border border-blue-gray-50 bg-blue-gray-50/50 dark:border-gray-600 dark:bg-gray-600 object-cover"
                                />
                                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 dark:text-gray-300 font-bold">
                                  {user.first_name} {user.last_name}
                                </p>
                              </div>
                            </td>
                            <td className="p-2">
                              <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 dark:text-gray-300 font-normal">
                                {user.email}
                              </p>
                            </td>
                            <td className="p-2">
                              <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 dark:text-gray-300 font-normal">
                                {user.phone_number}
                              </p>
                            </td>
                            <td className="p-2">
                              <div className="w-max">
                                <div className="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-green-500/20 text-green-900 py-1 px-2 text-xs rounded-md dark:text-green-300 dark:bg-green-700/30">
                                  <span className="">{user.is_active ? t('Active') : t('Inactive')}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-2">
                              <Link
                                to={`/readerdetails/${user.id}`}
                                className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 dark:text-gray-300 hover:bg-gray-900/10 dark:hover:bg-gray-700/30 active:bg-gray-900/20 dark:active:bg-gray-700/50"
                                type="button"
                              >
                                <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                  >
                                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                                  </svg>
                                </span>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-primary p-4 rounded-lg shadow-md">
              <div className="xl:flex justify-between items-center">
                <h2 className="font-semibold text-2xl dark:text-white mb-4 xl:mb-0">{t('New Books')}</h2>
                <Link
                  to="/books"
                  className="items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none w-fit"
                >
                  {t('View All')} <MdArrowForwardIos />
                </Link>
              </div>
              {isLoading ? (
                <Skeleton width="100%" height="200px" />
              ) : (
                <div className="p-3 px-0">
                  {/* Responsive Table Container */}
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max table-auto text-left font-montserrat">
                      <thead className="text-xs font-semibold uppercase bg-gray-50 dark:bg-gray-700 rounded">
                        <tr>
                          <th className="border-blue-gray-100 bg-blue-gray-50/50 dark:bg-gray-700 p-4">
                            <p className="block antialiased font-sans text-sm text-blue-gray-900 dark:text-gray-300 font-normal leading-none opacity-70">
                              {t('Title')}
                            </p>
                          </th>
                          <th className="border-blue-gray-100 bg-blue-gray-50/50 dark:bg-gray-700 p-4">
                            <p className="block antialiased font-sans text-sm text-blue-gray-900 dark:text-gray-300 font-normal leading-none opacity-70">
                              {t('Author')}
                            </p>
                          </th>
                          <th className="border-blue-gray-100 bg-blue-gray-50/50 dark:bg-gray-700 p-4">
                            <p className="block antialiased font-sans text-sm text-blue-gray-900 dark:text-gray-300 font-normal leading-none opacity-70">
                              {t('Publisher')}
                            </p>
                          </th>
                          <th className="border-blue-gray-100 bg-blue-gray-50/50 dark:bg-gray-700 p-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {books.map((book) => (
                          <tr key={book.id}>
                            <td className="p-2">
                              <div className="flex items-center gap-3">
                                <img
                                  src={book?.coverImage || '/img/blank-book-cover-over-png.png'}
                                  alt={`${book.title} cover`}
                                  className="inline-block relative object-center w-8 border border-blue-gray-50 bg-blue-gray-50/50 dark:border-gray-600 dark:bg-gray-600 object-contain"
                                />
                                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 dark:text-gray-300 font-bold">
                                  {book.title}
                                </p>
                              </div>
                            </td>
                            <td className="p-2">
                              <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 dark:text-gray-300 font-normal">
                                {book.author}
                              </p>
                            </td>
                            <td className="p-2">
                              <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 dark:text-gray-300 font-normal">
                                {book.publisher}
                              </p>
                            </td>
                            <td className="p-2">
                              <Link
                                to={`/bookdetails/${book.id}`}
                                className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 dark:text-gray-300 hover:bg-gray-900/10 dark:hover:bg-gray-700/30 active:bg-gray-900/20 dark:active:bg-gray-700/50"
                                type="button"
                              >
                                <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                  >
                                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                                  </svg>
                                </span>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white dark:bg-primary p-4 rounded-lg shadow-md">
              <div className="xl:flex justify-between items-center">
                <h2 className="font-semibold text-2xl dark:text-white">{t('New Readers & Borrowings')}</h2>
              </div>
              {isLoading ? (
                <Skeleton width="100%" height="300px" />
              ) : (
                <div>
                  <StatsChart borrowData={borrowData} readersData={readersData} title={t('Readers & Borrowings Over Time')} />
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-primary p-4 rounded-lg shadow-md">
              <div className="xl:flex justify-between items-center">
                <h2 className="font-semibold text-2xl dark:text-white mb-4 xl:mb-0">{t('Overdue')}</h2>
                <Link
                  to="/delays"
                  className="items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none w-fit"
                >
                  {t('View All')} <MdArrowForwardIos />
                </Link>
              </div>
              {isLoading ? (
                <Skeleton width="100%" height="200px" />
              ) : (
                <div className="p-3 px-0">
                  {/* Responsive Table Container */}
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-max table-auto text-left font-montserrat">
                      <thead className="text-xs font-semibold uppercase bg-gray-50 dark:bg-gray-700 rounded">
                        <tr>
                          <th className="border-blue-gray-100 bg-blue-gray-50/50 dark:bg-gray-700 p-4">
                            <p className="block antialiased font-sans text-sm text-blue-gray-900 dark:text-gray-300 font-normal leading-none opacity-70">
                              {t('Title')}
                            </p>
                          </th>
                          <th className="border-blue-gray-100 bg-blue-gray-50/50 dark:bg-gray-700 p-4">
                            <p className="block antialiased font-sans text-sm text-blue-gray-900 dark:text-gray-300 font-normal leading-none opacity-70">
                              {t('Reader')}
                            </p>
                          </th>
                          <th className="border-blue-gray-100 bg-blue-gray-50/50 dark:bg-gray-700 p-4">
                            <p className="block antialiased font-sans text-sm text-blue-gray-900 dark:text-gray-300 font-normal leading-none opacity-70">
                              {t('Delay')}
                            </p>
                          </th>
                          <th className="border-blue-gray-100 bg-blue-gray-50/50 dark:bg-gray-700 p-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {overdueBooks.map((borrowing) => (
                          <tr key={borrowing.id}>
                            <td className="p-2">
                              <div className="flex items-center gap-3">
                                <img
                                  src={borrowing.book.coverImage || '/img/blank-book-cover-over-png.png'}
                                  alt={`${borrowing.book.title} cover`}
                                  className="inline-block relative object-center w-8 border border-blue-gray-50 bg-blue-gray-50/50 dark:border-gray-600 dark:bg-gray-600 object-contain"
                                />
                                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 dark:text-gray-300 font-bold">
                                  {borrowing.book.title}
                                </p>
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex items-center gap-3">
                                <img
                                  src={borrowing.user.profile_picture || '/img/profile-icon-design.jpg'}
                                  alt={`${borrowing.user.first_name}'s profile`}
                                  className="inline-block w-12 h-12 rounded-full border border-blue-gray-50 bg-blue-gray-50/50 dark:border-gray-600 dark:bg-gray-600 object-cover p-0"
                                />
                                <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 dark:text-gray-300 font-bold">
                                  {borrowing.user.first_name} {borrowing.user.last_name}
                                </p>
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="w-max">
                                <div className="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-red-500/20 text-red-900 dark:text-red-300 dark:bg-red-700/30 py-1 px-2 text-xs rounded-md">
                                  <span>
                                    {Math.floor(
                                      (new Date() - new Date(borrowing.borrowing_date)) / (1000 * 60 * 60 * 24)
                                    )}{' '}
                                    {t('days')}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-2">
                              <Link
                                to={`/readerdetails/${borrowing.user.id}`}
                                className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 dark:text-gray-300 hover:bg-gray-900/10 dark:hover:bg-gray-700/30 active:bg-gray-900/20 dark:active:bg-gray-700/50"
                                type="button"
                              >
                                <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    className="h-4 w-4"
                                  >
                                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                                  </svg>
                                </span>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Dashboard;
