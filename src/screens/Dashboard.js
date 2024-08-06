import React, { useEffect, useState } from 'react';
import { FaBars, FaSearch, FaHome } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { MdArrowForwardIos } from "react-icons/md";
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import Footer from '../components/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Skeleton = ({ width, height }) => (
  <div style={{ width, height, backgroundColor: '#e0e0e0' }} className="rounded animate-pulse m-3 mx-0"></div>
);

const StatsChart = ({ borrowData, readersData, title }) => {
  const data = {
    labels: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
    datasets: [
      {
        label: 'Wypożyczenia',
        data: borrowData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        fill: false
      },
      {
        label: 'Nowi czytelnicy',
        data: readersData,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return <Line data={data} options={options} />;
};

const Dashboard = () => {
  const [borrowData, setBorrowData] = useState([]);
  const [readersData, setReadersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchBorrowData = async () => {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/borrowingsmonthly`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBorrowData(data);
      } else {
        console.error('Failed to fetch borrow data');
        navigate('/login');
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
          'Authorization': `Bearer ${token}`
        }
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
  const navigate = useNavigate();


  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookCount, setBookCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [overdueBooks, setOverdueBooks] = useState([]);

  useEffect(() => {
    const fetchOverdueBooks = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/filteredBorrowingsfive`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
          'Authorization': `Bearer ${token}`
        }
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
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      } else {
        console.error('Failed to fetch user data');
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchbookCount = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/count/books`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookCount(data.count);
      } else {
        console.error('Failed to fetch book count data');
      }
    };

    const fetchuserCount = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/count/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserCount(data.count);
      } else {
        console.error('Failed to fetch user count data');
      }
    };
    
    fetchbookCount();
    fetchuserCount();
  }, []);

  return (
    <div className="min-h-screen flex font-montserrat bg-[#f6f5ff] ">
      <Menu />
      {/* Main Content */}
      <main className="flex-1 pl-[16rem]">
        <TopHeader />
        <div className="p-6">
          <div className="flex justify-left items-center mb-4 gap-4 items-center">
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              {isLoading ? (
                <Skeleton width="100%" height="80px" />
              ) : (
                <div className='flex justify-between items-center gap-5'>
                  <img src="/img/reader_4213477.png" alt="Settings" className="w-[15%]" />
                  <div className='w-[85%]'>
                    <h2 className="text-xl font-semibold">Łączna ilość czytelników</h2>
                    <p className="text-2xl mt-2">{userCount}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md h-auto">
              {isLoading ? (
                <Skeleton width="100%" height="80px" />
              ) : (
                <div className='flex justify-between items-center gap-5'>
                  <img src="/img/book_4213400.png" alt="Settings" className="w-[15%]" />
                  <div className='w-[85%]'>
                    <h2 className="text-xl font-semibold">Łączna ilość księgozbioru</h2>
                    <p className="text-2xl mt-2">{bookCount}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              {isLoading ? (
                <Skeleton width="100%" height="80px" />
              ) : (
                <div className='flex justify-between items-center gap-5'>
                  <img src="/img/book_4213426.png" alt="Settings" className="w-[15%]" />
                  <div className='w-[85%]'>
                    <h2 className="text-xl font-semibold">Łączna ilość wypożyczeń</h2>
                    <p className="text-2xl mt-2">{bookCount}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Charts and Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className='flex justify-between items-center'>
                <h2 className="font-semibold text-2xl">Nowi czytelnicy</h2>
                <Link to="/readers" className="items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none">Zobacz wszystkich <MdArrowForwardIos /></Link>
              </div>
              {isLoading ? (
                <Skeleton width="100%" height="200px" />
              ) : (
                <div className="p-3 px-0">
                  <table className="w-full min-w-max table-auto text-left font-montserrat">
                    <thead className='text-xs font-semibold uppercase bg-gray-50 rounded'>
                      <tr>
                        <th className="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Czytelnik</p>
                        </th>
                        <th className="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Email</p>
                        </th>
                        <th className="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Telefon</p>
                        </th>
                        <th className="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Aktywny</p>
                        </th>
                        <th className="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70"></p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(users => (
                        <tr key={users.id}>
                          <td className="p-2">
                            <div className="flex items-center gap-3">
                              <img src={users.profile_picture} alt={`${users.first_name}'s profile`} className="inline-block relative object-center !rounded-full w-12 h-12 rounded-lg border border-blue-gray-50 bg-blue-gray-50/50 object-cover" />
                              <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">{users.first_name} {users.last_name}</p>
                            </div>
                          </td>
                          <td className="p-2">
                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{users.email}</p>
                          </td>
                          <td className="p-2">
                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{users.phone_number}</p>
                          </td>
                          <td className="p-2">
                            <div className="w-max">
                              <div className="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-green-500/20 text-green-900 py-1 px-2 text-xs rounded-md">
                                <span className="">{users.is_active ? 'Active' : 'Inactive'}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-2">
                            <Link to={`/readerdetails/${users.id}`} className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20">
                              <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
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
              )}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className='flex justify-between items-center'>
                <h2 className="font-semibold text-2xl">Nowości w księgozbiorach</h2>
                <Link to="/books" className="items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none">Zobacz wszystkie <MdArrowForwardIos /></Link>
              </div>
              {isLoading ? (
                <Skeleton width="100%" height="200px" />
              ) : (
                <div className="p-3 px-0">
                  <table className="w-full min-w-max table-auto text-left font-montserrat">
                    <thead className='text-xs font-semibold uppercase bg-gray-50 rounded'>
                      <tr>
                        <th className="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Tytuł</p>
                        </th>
                        <th className="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Autor</p>
                        </th>
                        <th className="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Wydawca</p>
                        </th>
                        <th className="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70"></p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map(book => (
                        <tr key={book.id}>
                          <td className="p-2">
                            <div className="flex items-center gap-3">
                              <img src={book?.coverImage || '/img/blank-book-cover-over-png.png'} alt={`${book.title} cover`} className="inline-block relative object-center w-8 border border-blue-gray-50 bg-blue-gray-50/50 object-contain" />
                              <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">{book.title}</p>
                            </div>
                          </td>
                          <td className="p-2">
                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{book.author}</p>
                          </td>
                          <td className="p-2">
                            <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{book.publisher}</p>
                          </td>
                          <td className="p-2">
                            <Link to={`/bookdetails/${book.id}`} className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20" type="button">
                              <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
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
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className='flex justify-between items-center'>
                <h2 className="font-semibold text-2xl">Nowi czytelnicy i wypożyczenia</h2>
              </div>
              {isLoading ? (
                <Skeleton width="100%" height="300px" />
              ) : (
                <div>
                  <StatsChart
                    borrowData={borrowData}
                    readersData={readersData}
                  />
                </div>
              )}
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className='flex justify-between items-center'>
                <h2 className="font-semibold text-2xl">Zaległości</h2>
                <Link to="/delays" className="items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none">Zobacz wszystkie <MdArrowForwardIos /></Link>
              
              </div>
              {isLoading ? (
                <Skeleton width="100%" height="200px" />
              ) : (
                <div className="p-3 px-0">
                  <table className="w-full min-w-max table-auto text-left font-montserrat">
                    <thead className='text-xs font-semibold uppercase bg-gray-50 rounded'>
                      <tr>
                        <th className="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Tytuł</p>
                        </th>
                        <th className="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">CZYTELNIK</p>
                        </th>
                        <th className="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Zwłoka</p>
                        </th>
                        <th className="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70"></p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {overdueBooks.map(borrowing => (
                        <tr key={borrowing.id}>
                          <td className="p-2">
                            <div className="flex items-center gap-3">
                              <img src={borrowing.book.coverImage || '/img/blank-book-cover-over-png.png'} alt={`${borrowing.book.title} cover`} className="inline-block relative object-center w-8  border border-blue-gray-50 bg-blue-gray-50/50 object-contain" />
                              <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">{borrowing.book.title}</p>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-3">
                              <img src={borrowing.user.profile_picture || 'https://taildash.tailwinddashboard.com/src/img/avatar/avatar.png'} alt={`${borrowing.user.first_name}'s profile`} className="inline-block w-12 h-12 rounded-full border border-blue-gray-50 bg-blue-gray-50/50 object-cover p-0" />
                              <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">{borrowing.user.first_name} {borrowing.user.last_name}</p>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="w-max">
                              <div className="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-red-500/20 text-red-900 py-1 px-2 text-xs rounded-md">
                                <span>{Math.floor((new Date() - new Date(borrowing.borrowing_date)) / (1000 * 60 * 60 * 24))} dni</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-2">
                            <Link to={`/readerdetails/${borrowing.user.id}`} className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20" type="button">
                              <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
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
