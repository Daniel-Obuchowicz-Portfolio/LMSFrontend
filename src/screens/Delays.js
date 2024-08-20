import React, { useEffect, useState, useRef } from 'react';
import { MdArrowForwardIos } from "react-icons/md";
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const Skeleton = ({ width, height }) => (
  <div style={{ width, height, backgroundColor: '#e0e0e0' }} className="rounded animate-pulse m-3 mx-0"></div>
);

const Delays = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null); 

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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const navigate = useNavigate();
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [borrowingsPerPage] = useState(10);

  useEffect(() => {
    const fetchOverdueBooks = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/filteredBorrowings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data && typeof data === 'object') {
          setOverdueBooks(Object.values(data));
        } else {
          console.error('Unexpected response format:', data);
          setOverdueBooks([]);
        }
      } else {
        console.error('Failed to fetch overdue books data');
      }
      setIsLoading(false);
    };

    fetchOverdueBooks();
  }, []);

  const indexOfLastItem = currentPage * borrowingsPerPage;
  const indexOfFirstItem = indexOfLastItem - borrowingsPerPage;
  const currentBorrowings = overdueBooks.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-montserrat bg-[#f6f5ff] dark:bg-gray-800 dark:text-white">
      <Menu sidebar={sidebarOpen} toggleSidebar={toggleSidebar} sidebarRef={sidebarRef} />
      <main className="flex-1 xl:pl-[16rem]">
        <TopHeader toggleSidebar={toggleSidebar} />
        <div className="p-6 min-h-[84.2vh]">

          <div className="md:flex items-center mb-6 gap-4">
            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex gap-2 items-center text-sm md:text-base mb-4 md:mb-0"
              onClick={() => navigate(-1)}
            >
              <IoIosArrowBack /> Powrót
            </button>
            <h1 className="text-lg md:text-xl font-bold">Zaległości</h1>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white dark:bg-primary rounded-lg shadow-md p-4 md:p-5">
              {isLoading ? (
                <Skeleton width="100%" height="200px" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-max table-auto text-left font-montserrat">
                    <thead className="text-xs font-semibold uppercase bg-gray-50 dark:bg-gray-700 rounded">
                      <tr>
                        <th className="p-3 md:p-5">
                          <p className="text-sm md:text-base text-blue-gray-900 dark:text-gray-300 font-normal leading-none opacity-70">Tytuł</p>
                        </th>
                        <th className="p-3 md:p-5">
                          <p className="text-sm md:text-base text-blue-gray-900 dark:text-gray-300 font-normal leading-none opacity-70">Czytelnik</p>
                        </th>
                        <th className="p-3 md:p-5">
                          <p className="text-sm md:text-base text-blue-gray-900 dark:text-gray-300 font-normal leading-none opacity-70">Zwłoka</p>
                        </th>
                        <th className="p-3 md:p-5">
                          <p className="text-sm md:text-base text-blue-gray-900 dark:text-gray-300 font-normal leading-none opacity-70"></p>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBorrowings.map(borrowing => (
                        <tr key={borrowing.id}>
                          <td className="p-3 md:p-5">
                            <div className="flex items-center gap-4 md:gap-6">
                              <img src={borrowing.book.coverImage || '/img/blank-book-cover-over-png.png'} alt={`${borrowing.book.title} cover`} className="w-8 md:w-10 object-contain" />
                              <p className="text-sm md:text-base font-bold text-blue-gray-900 dark:text-gray-300">{borrowing.book.title}</p>
                            </div>
                          </td>
                          <td className="p-3 md:p-5">
                            <div className="flex items-center gap-4 md:gap-6">
                              <img src={borrowing.user.profile_picture || '/img/profile-icon-design.jpg'} alt={`${borrowing.user.first_name}'s profile`} className="w-10 md:w-12 h-10 md:h-12 rounded-full object-cover" />
                              <p className="text-sm md:text-base font-bold text-blue-gray-900 dark:text-gray-300">{borrowing.user.first_name} {borrowing.user.last_name}</p>
                            </div>
                          </td>
                          <td className="p-3 md:p-5">
                            <div className="w-max">
                              <div className="relative grid items-center font-sans font-bold uppercase whitespace-nowrap select-none bg-red-500/20 dark:bg-red-900 text-red-900 dark:text-red-500 py-1 px-2 text-xs rounded-md">
                                <span>{Math.floor((new Date() - new Date(borrowing.borrowing_date)) / (1000 * 60 * 60 * 24))} dni</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 md:p-5">
                            <Link to={`/readerdetails/${borrowing.user.id}`} className="relative w-8 h-8 md:w-10 md:h-10 rounded-lg text-gray-900 dark:text-gray-300 hover:bg-gray-900/10 dark:hover:bg-gray-300/10 flex items-center justify-center">
                              <MdArrowForwardIos className="h-4 w-4" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {/* Pagination Controls */}
              <Pagination
                borrowingsPerPage={borrowingsPerPage}
                totalBorrowings={overdueBooks.length}
                paginate={paginate}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>

          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

const Pagination = ({ borrowingsPerPage, totalBorrowings, paginate, currentPage, setCurrentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalBorrowings / borrowingsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    setCurrentPage(pageNumbers.length);
  };

  return (
    <nav className="mt-4 flex justify-between">
      <ul className="flex gap-2">
        <li className={`page-item ${currentPage === 1 ? 'hidden' : ''}`}>
          <button
            onClick={handlePrevPage}
            className="px-3 py-1 border rounded items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none"
          >
            Prev
          </button>
        </li>
        {pageNumbers.map(number => (
          <li key={number} className="page-item hidden md:block">
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 border rounded items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 ${currentPage === number ? 'bg-red-700 text-white' : 'text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600'}`}
            >
              {number}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === pageNumbers.length ? 'hidden' : ''}`}>
          <button
            onClick={handleNextPage}
            className="px-3 py-1 border rounded items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none"
          >
            Next
          </button>
        </li>
        <li className={`page-item ${currentPage === pageNumbers.length ? 'hidden' : ''}`}>
          <button
            onClick={handleLastPage}
            className="px-3 py-1 border rounded items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none"
          >
            Last
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Delays;
