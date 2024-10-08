import React, { useEffect, useState, useRef } from 'react';
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { RiExternalLinkFill } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import { BsCalendarDate } from "react-icons/bs";
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const Books = () => {
  const { t } = useTranslation('books');
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

  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState('');

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
      console.error('Failed to fetch book data');
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchSearchResults = async (query) => {
    if (!query) return;
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/booksearch?query=${query}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setBooks(data);
    } else {
      console.error('Failed to fetch search results');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      fetchBooks();
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        fetchSearchResults(searchQuery);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSearchResults(searchQuery);
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex font-montserrat bg-[#f6f5ff] dark:bg-gray-800 dark:text-white">
      <Menu sidebar={sidebarOpen} toggleSidebar={toggleSidebar} sidebarRef={sidebarRef} />
      <main className="flex-1 xl:pl-[16rem]">
        <TopHeader toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />
        <div className="p-6 min-h-[84.2vh]">
          <div className="xl:flex justify-between items-center mb-4">
            <div className="xl:flex items-center mb-6 gap-4">
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex gap-2 items-center text-sm xl:text-base mb-4 xl:mb-0"
                onClick={() => navigate(-1)}
              >
                <IoIosArrowBack /> {t('Back')}
              </button>
              <h1 className="text-xl font-bold dark:text-white">{t('Books Collection')}</h1>
            </div>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder={t('Search') + "..."}
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-4 py-2 rounded-lg border border-gray-300 pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 w-full"
              />
              <button type="submit" className="absolute right-3 text-gray-400">
                <FaSearch />
              </button>
            </form>
          </div>
          <div className="mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentBooks.map(book => (
                <div key={book.id} className="bg-white dark:bg-primary shadow-md rounded transition-transform transform hover:scale-105">
                  <div className="pt-[30%] bg-cover bg-[url('https://elearningindustry.com/wp-content/uploads/2016/05/top-10-books-every-college-student-read-e1464023124869.jpeg')] rounded"></div>
                  <div className='px-4'>
                    <div className='w-[100px] bg-[#ffffff] dark:bg-gray-900 mr-auto mt-[-25%] rounded-[4px]'>
                      <img className={book?.coverImage ? 'w-[100px] h-[159px] object-cover rounded-[4px]' : 'w-[100px] h-[159px] rounded-[4px]'} src={book?.coverImage || '/img/blank-book-cover-over-png.png'} alt={`${book.title}`} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-2xl font-bold mb-1 dark:text-white">{book.title}</h3>
                    <p className="mb-1 flex gap-3 items-center dark:text-gray-300"><IoPerson /> {book.author}</p>
                    <p className="flex gap-3 items-center dark:text-gray-300"><BsCalendarDate /> {new Date(book.publicationDate).toLocaleDateString('pl-PL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                    <Link to={`/bookdetails/${book.id}`} className="w-fit mt-3 px-3 py-1 border rounded items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none">{t('Details')} <RiExternalLinkFill /></Link>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              itemsPerPage={booksPerPage}
              totalItems={books.length}
              paginate={paginate}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage, setCurrentPage }) => {
  const { t } = useTranslation('books');
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-4 flex justify-left">
      <ul className="flex gap-2">
        {currentPage > 1 && (
          <li className="page-item">
            <button onClick={() => paginate(currentPage - 1)} className="px-3 py-1 border rounded text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none">
              {t('Previous')}
            </button>
          </li>
        )}
        {pageNumbers.map(number => (
          <li key={number} className="page-item">
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 border rounded ${currentPage === number ? 'bg-red-700 text-white' : 'text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600'}`}
            >
              {number}
            </button>
          </li>
        ))}
        {currentPage < pageNumbers.length && (
          <li className="page-item">
            <button onClick={() => paginate(currentPage + 1)} className="px-3 py-1 border rounded text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none">
              {t('Next')}
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Books;
