import React, { useEffect, useState } from 'react';
import { MdArrowForwardIos } from "react-icons/md";
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";

const Skeleton = ({ width, height }) => (
  <div style={{ width, height, backgroundColor: '#e0e0e0' }} className="rounded animate-pulse m-3 mx-0"></div>
);

const Delays = () => {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [borrowingsPerPage] = useState(10); // You can set this to any number you like

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
        setOverdueBooks(data);
      } else {
        console.error('Failed to fetch overdue books data');
      }
      setIsLoading(false);
    };

    fetchOverdueBooks();
  }, []);

  // Calculate the current items
  const indexOfLastItem = currentPage * borrowingsPerPage;
  const indexOfFirstItem = indexOfLastItem - borrowingsPerPage;
  const currentBorrowings = overdueBooks.slice(indexOfFirstItem, indexOfLastItem);

  // Function to change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex font-montserrat bg-[#f6f5ff] ">
      <Menu />
      <main className="flex-1 pl-[16rem]">
        <TopHeader />
        <div className="p-6 min-h-[84.2vh]">
          <div className="flex justify-left items-center mb-4 gap-4 items-center">
            <h1 className="text-xl font-bold">Zaległości</h1>
          </div>

          <div className="grid grid-cols-1 gap-6 ">
            <div className="bg-white rounded-lg shadow-md p-5">
              {isLoading ? (
                <Skeleton width="100%" height="200px" />
              ) : (
                <div className="">
                  <table className="w-full min-w-max table-auto text-left font-montserrat">
                    <thead className='text-xs font-semibold uppercase bg-gray-50 rounded'>
                      <tr>
                        <th className="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Tytuł</p>
                        </th>
                        <th className="border-blue-gray-100 bg-blue-gray-50/50 p-4">
                          <p className="block antialiased font-sans text-sm text-blue-gray-900 font-normal leading-none opacity-70">Czytelnik</p>
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
                      {currentBorrowings.map(borrowing => (
                        <tr key={borrowing.id}>
                          <td className="p-2">
                            <div className="flex items-center gap-3">
                              <img src={borrowing.book.coverImage || '/img/blank-book-cover-over-png.png'} alt={`${borrowing.book.title} cover`} className="inline-block relative object-center w-8 border border-blue-gray-50 bg-blue-gray-50/50 object-contain" />
                              <p className="block antialiased font-sans text-sm leading-normal text-blue-gray-900 font-bold">{borrowing.book.title}</p>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex items-center gap-3">
                              <img src={borrowing.user.profile_picture || 'https://taildash.tailwindDelays.com/src/img/avatar/avatar.png'} alt={`${borrowing.user.first_name}'s profile`} className="inline-block w-12 h-12 rounded-full border border-blue-gray-50 bg-blue-gray-50/50 object-cover p-0" />
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
    <nav className="mt-4 flex justify-left">
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
          <li key={number} className="page-item">
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
