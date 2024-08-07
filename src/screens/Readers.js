import React, { useEffect, useState } from 'react';
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import { FaBars, FaSearch, FaHome } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { MdOutlineMail, MdLocalPhone  } from "react-icons/md";
import { RiExternalLinkFill } from "react-icons/ri";
import Footer from '../components/Footer';




const Readers = () => {


  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(8);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

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

  const fetchSearchResults = async (query) => {
    if (!query) return;
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/usersearch?query=${query}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      setUsers(data);
      setIsSearching(true);
    } else {
      console.error('Failed to fetch search results');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setIsSearching(false);
      // Fetch users again when search query is cleared
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
    }
  };

  useEffect(() => {
    if (!searchQuery) return;

    const timeoutId = setTimeout(() => {
      fetchSearchResults(searchQuery);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSearchResults(searchQuery);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const navigate = useNavigate();


  return (
    <div className="min-h-screen flex font-montserrat bg-[#f6f5ff] ">
      <Menu />
      {/* Main Content */}
      <main className="flex-1 pl-[16rem]">
      <TopHeader/>
        <div className="p-6 min-h-[84.2vh]">
          <div className="flex justify-between items-center mb-4">
          <div className="flex justify-left items-center mb-4 gap-4 items-center">
            <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex gap-3 items-center" onClick={() => navigate(-1)}><IoIosArrowBack /> Powrót</button> <h1 className="text-xl font-bold"> Czytelnicy</h1>
          </div>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="px-4 py-2 rounded-lg border border-gray-300 pr-10"
              />
              <button type="submit" className="absolute right-3 text-gray-400">
                <FaSearch />
              </button>
              </form>
          </div>
          <div className=" mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {currentUsers.map(user => (
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
              <Pagination
                usersPerPage={usersPerPage}
                totalUsers={users.length}
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

const Pagination = ({ usersPerPage, totalUsers, paginate, currentPage, setCurrentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
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

export default Readers;
