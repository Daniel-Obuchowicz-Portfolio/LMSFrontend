import React, { useState } from 'react';
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import Footer from '../components/Footer';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineMail, MdLocalPhone  } from "react-icons/md";
import { RiExternalLinkFill } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";
import { BsCalendarDate } from "react-icons/bs";

const Search = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [readers, setReaders] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim() === '') return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const bookResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/booksearch?query=${query}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const readerResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/usersearch?query=${query}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (bookResponse.ok && readerResponse.ok) {
        const bookData = await bookResponse.json();
        const readerData = await readerResponse.json();
        setBooks(bookData);
        setReaders(readerData);
        setRecentSearches((prev) => [...new Set([query, ...prev].slice(0, 5))]); // Zachowaj unikalne wyszukiwania
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Błąd',
          text: 'Nie udało się pobrać wyników wyszukiwania',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Błąd',
        text: 'Wystąpił niespodziewany błąd',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecentSearchClick = (search) => {
    setQuery(search);
    handleSearch({ preventDefault: () => {} }); // Ręczne wywołanie wyszukiwania
  };

  return (
    <div className="min-h-screen flex font-montserrat bg-gray-100">
      <Menu />
      <main className="flex-1 pl-[16rem]">
        <TopHeader />
        <div className="flex p-6 gap-6">
            {/* Main Content */}
          <div className="w-3/4">
            <div className="mb-6">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Wyszukaj książki lub czytelników..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring focus:border-red-300"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:ring focus:bg-red-300 my-[-3px]"
                >
                  Szukaj
                </button>
              </form>
            </div>
            <div className="grid grid-cols-1 gap-8">
              {/* Books Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Książki</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  {isLoading ? (
                    <p className="text-gray-500">Ładowanie...</p>
                  ) : books.length === 0 ? (
                    <p className="text-gray-500">Brak wyników</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {books.map(book => (
                            <div key={book.id} className="bg-white shadow-md rounded transition-transform transform hover:scale-105">
                            <div className="pt-[30%] bg-cover bg-[url('https://elearningindustry.com/wp-content/uploads/2016/05/top-10-books-every-college-student-read-e1464023124869.jpeg')] rounded"></div>
                            <div className='px-4'>
                                <div className='w-[100px] bg-[#ffffff] mr-auto mt-[-25%] rounded-[4px]'>
                                <img className={book?.coverImage ? 'w-[100px] h-[159px] object-cover rounded-[4px]' : 'w-[100px] h-[159px] rounded-[4px]'} src={book?.coverImage || '/img/blank-book-cover-over-png.png'} alt={`${book.title}`} />
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-2xl font-bold mb-1">{book.title}</h3>
                                <p className="mb-1 flex gap-3 items-center"><IoPerson /> {book.author}</p>
                                <p className="flex gap-3 items-center"><BsCalendarDate /> {new Date(book.publicationDate).toLocaleDateString('pl-PL', {
                                year: 'numeric',
                                month: 'long', 
                                day: 'numeric' 
                                })}</p>
                                <Link to={`/bookdetails/${book.id}`} className="w-fit mt-3 px-3 py-1 border rounded items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none">Szczegóły <RiExternalLinkFill/></Link>
                            </div>
                            </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Readers Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Czytelnicy</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  {isLoading ? (
                    <p className="text-gray-500">Ładowanie...</p>
                  ) : readers.length === 0 ? (
                    <p className="text-gray-500">Brak wyników</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {readers.map(user => (
                        <div key={user.id} className="bg-white shadow-md rounded transition-transform transform hover:scale-105">
                            <div className="pt-[30%] bg-cover bg-[url(https://elearningindustry.com/wp-content/uploads/2016/05/top-10-books-every-college-student-read-e1464023124869.jpeg)] rounded"></div>
                            <div className='w-[140px] rounded-full bg-[#ffffff] mx-auto mt-[-25%] border-4 border-[#ef4444]'>
                            <img className='w-[132px] h-[132px] object-cover rounded-full' src={user?.profile_picture || '/img/profile-icon-design.jpg'} alt={`${user.first_name} ${user.last_name}`} />
                            </div>
            
                            <div className="p-4">
                            <h3 className="text-2xl font-bold mb-1">{user.first_name} {user.last_name}</h3>
                            <p className="mb-1 flex gap-3 items-center"><MdOutlineMail/> {user.email}</p>
                            <p className="flex gap-3 items-center"><MdLocalPhone /> {user.phone_number}</p>
                            <Link to={`/readerdetails/${user.id}`} className="w-fit mt-3 px-3 py-1 border rounded items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none">Szczegóły <RiExternalLinkFill/> </Link>
                            </div>
                        </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Recent Searches */}
          <aside className="w-1/4 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Ostatnie wyszukiwania</h2>
            <ul className="space-y-2">
              {recentSearches.map((search, index) => (
                <li key={index} className="cursor-pointer text-red-600 hover:underline" onClick={() => handleRecentSearchClick(search)}>
                  {search}
                </li>
              ))}
            </ul>
          </aside>
          
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default Search;
