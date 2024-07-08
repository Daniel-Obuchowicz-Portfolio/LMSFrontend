import React, { useEffect, useState } from 'react';
import { FaBars, FaSearch, FaHome } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { MdArrowForwardIos } from "react-icons/md";
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";




ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
  const borrowData = [65, 59, 80, 81, 56, 55, 60, 76, 75, 88, 94, 100];
  const readersData = [28, 48, 40, 19, 86, 27, 45, 82, 58, 33, 90, 95];
  const navigate = useNavigate();


  const [books, setBooks] = useState([]);

  const [users, setUsers] = useState([]);

  const [bookCount, setBookCount] = useState(0);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users`, {
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books`, {
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
    const token = localStorage.getItem('token')
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
        console.error('Failed to fetch user data');
      }
    }
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
        console.error('Failed to fetch user data');
      }
    }
    
    fetchbookCount();
    fetchuserCount();
  }, []);


  return (
    <div className="min-h-screen flex font-montserrat bg-[#f6f5ff] ">
      <Menu />
      {/* Main Content */}
      <main className="flex-1 pl-[16rem]">
      <TopHeader/>
        <div className="p-6">
          <div className="flex justify-left items-center mb-4 gap-4 items-center">
            <h1 className="text-xl font-bold"> Dashboard</h1>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className='flex justify-between items-center gap-5'>
                <img src="/img/reader_4213477.png" alt="Settings" class="w-[15%]" />
                <div className='w-[85%]'>
                  <h2 className="text-xl font-semibold">Łączna ilość czytelników</h2>
                  <p className="text-2xl mt-2">{userCount}</p>
                  {/* <p className="text-green-500 mt-1">+55% since yesterday</p> */}
                </div>
              </div>
              
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md h-auto">
              <div className='flex justify-between items-center gap-5'>
                <img src="/img/book_4213400.png" alt="Settings" class="w-[15%]" />
                <div className='w-[85%]'>
                  <h2 className="text-xl font-semibold">Łączna ilość księgozbioru</h2>
                  <p className="text-2xl mt-2">{bookCount}</p>
                  {/* <p className="text-green-500 mt-1">+55% since yesterday</p> */}
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
            <div className='flex justify-between items-center gap-5'>
                <img src="/img/book_4213426.png" alt="Settings" class="w-[15%]" />
                <div className='w-[85%]'>
                  <h2 className="text-xl font-semibold">Łączna ilość wypożyczeń</h2>
                  <p className="text-2xl mt-2">{bookCount}</p>
                  {/* <p className="text-green-500 mt-1">+55% since yesterday</p> */}
                </div>
              </div>
            </div>

          </div>

          {/* Charts and Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className='flex justify-between items-center'>
                <h2 className="font-semibold text-2xl">Nowi czytelnicy</h2>
                <Link to="/readers" class="items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none">Zobacz wszystkich <MdArrowForwardIos /></Link>
              </div>
              <div class="p-3 px-0">
                <table class="w-full min-w-max table-auto text-left font-montserrat">
                  <thead className='text-xs font-semibold uppercase bg-gray-50 rounded'>
                    <tr>
                      <th class="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Czytelnik</p>
                      </th>
                      <th class="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Email</p>
                      </th>
                      <th class="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Telefon</p>
                      </th>
                      <th class="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Aktywny</p>
                      </th>
                      <th class="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70"></p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(users => (
                      <tr key={users.id}>
                        <td class="p-2">
                          <div class="flex items-center gap-3">
                            <img src={users.profile_picture} alt={`${users.first_name}'s profile`} class="inline-block relative object-center !rounded-full w-12 h-12 rounded-lg border border-blue-gray-50 bg-blue-gray-50/50 object-cover" />
                            <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">{users.first_name} {users.last_name}</p>
                          </div>
                        </td>
                        <td class="p-2">
                          <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{users.email}</p>
                        </td>
                        <td class="p-2">
                          <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{users.phone_number}</p>
                        </td>

                        
                        <td class="p-2">
                          <div class="w-max">
                            <div class="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-green-500/20 text-green-900 py-1 px-2 text-xs rounded-md">
                              <span class="">{users.is_active ? 'Active' : 'Inactive'}</span>
                            </div>
                          </div>
                        </td>
                        <td class="p-2">
                        <Link to={`/readerdetails/${users.id}`} className="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20">
                         <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-4 w-4">
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
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className='flex justify-between items-center'>
                <h2 className="font-semibold text-2xl">Nowości w księgozbiorach</h2>
                <a href="#" class="items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none">Zobacz wszystkie <MdArrowForwardIos /></a>
              </div>

              <div class="p-3 px-0">
                <table class="w-full min-w-max table-auto text-left font-montserrat">
                  <thead className='text-xs font-semibold uppercase bg-gray-50 rounded'>
                    <tr>
                      <th class="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Tytuł</p>
                      </th>
                      <th class="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Autor</p>
                      </th>
                      <th class="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Wydawca</p>
                      </th>
                      <th class="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70"></p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map(book => (
                      <tr key={book.id}>
                        <td class="p-2">
                          <div class="flex items-center gap-3">
                            <img src={book.coverImage} alt={`${book.title}'s profile`} class="inline-block relative object-center w-13 h-20 rounded-lg border border-blue-gray-50 bg-blue-gray-50/50 object-contain" />
                            <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">{book.title}</p>
                          </div>
                        </td>
                        <td class="p-2">
                          <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{book.author}</p>
                        </td>
                        <td class="p-2">
                          <p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-normal">{book.publisher}</p>
                        </td>

                        <td class="p-2">
                          <button class="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20" type="button">
                            <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-4 w-4">
                                <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                              </svg>
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className='flex justify-between items-center'>
                <h2 className="font-semibold text-2xl">Nowi czytelnicy i wypożyczenia</h2>
                <a href="#" class="items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none">Więcej statystyk <MdArrowForwardIos /></a>
              </div>
              <div>
                <StatsChart
                  borrowData={borrowData}
                  readersData={readersData}
                />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className='flex justify-between items-center'>
                <h2 className="font-semibold text-2xl">Zaległości</h2>
                <a href="#" class="items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none">Zobacz wszystkie <MdArrowForwardIos /></a>
              </div>
              <div class="p-3 px-0">
                <table class="w-full min-w-max table-auto text-left font-montserrat">
                  <thead className='text-xs font-semibold uppercase bg-gray-50 rounded'>
                    <tr>
                      <th class="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Tytuł</p>
                      </th>
                      <th class="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">CZYTELNIK</p>
                      </th>
                      <th class="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Zwłoka</p>
                      </th>
                      <th class="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                        <p class="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70"></p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="p-2"><div class="flex items-center gap-3"><img src="https://edit.org/images/cat/book-covers-big-2019101610.jpg" alt="Sample Book's profile" class="inline-block relative object-center w-13 h-20 rounded-lg border border-blue-gray-50 bg-blue-gray-50/50 object-contain" /><p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">Sample Book</p></div></td>
                      <td class="p-2"><div class="flex items-center gap-3"><img src="https://taildash.tailwinddashboard.com/src/img/avatar/avatar.png" alt="John's profile" class="inline-block relative object-center !rounded-full w-12 h-12 rounded-lg border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1" /><p class="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">John Doe</p></div></td>
                      <td class="p-2"><div class="w-max"><div class="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-green-500/20 text-green-900 py-1 px-2 text-xs rounded-md"><span class="">12 dni</span></div></div></td>
                      <td class="p-2">
                        <button class="relative align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-gray-900 hover:bg-gray-900/10 active:bg-gray-900/20" type="button">
                          <span class="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="h-4 w-4">
                              <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z"></path>
                            </svg>
                          </span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
