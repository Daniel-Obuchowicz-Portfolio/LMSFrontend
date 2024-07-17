import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import Swal from 'sweetalert2';
import { IoIosArrowBack } from "react-icons/io";
import { MdArrowForwardIos } from "react-icons/md";
import { LuBookPlus } from "react-icons/lu";
import Modal from '../components/Modal';

const ReaderdetailsBorrowings = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [borrowings, setBorrowings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [borrowingsPerPage] = useState(8);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBorrowing, setNewBorrowing] = useState({
    book_id: '',
    borrowing_date: '',
    realreturndate: '',
    comments: ''
  });
  const [bookSearchResults, setBookSearchResults] = useState([]);
  const [bookTitle, setBookTitle] = useState('');

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
          title: 'Error',
          text: 'Failed to fetch user data',
        });
      }
      setIsLoading(false);
    };

    const fetchBorrowings = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/borrowings/user/${id}`, {
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
          title: 'Error',
          text: 'Failed to fetch borrowings data',
        });
      }
    };

    fetchUser();
    fetchBorrowings();
  }, [id]);

  const indexOfLastBorrowing = currentPage * borrowingsPerPage;
  const indexOfFirstBorrowing = indexOfLastBorrowing - borrowingsPerPage;
  const currentBorrowings = borrowings.slice(indexOfFirstBorrowing, indexOfLastBorrowing);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const navigate = useNavigate();

  const handleAddBorrowingClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSave = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/readerdetails/${id}/borrow`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newBorrowing)
    });
  
    if (response.ok) {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/borrowings/user/${id}`, {
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
          title: 'Error',
          text: 'Failed to fetch borrowings data',
        });
      }
      setIsModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Borrowing record added successfully',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add borrowing record',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBorrowing({ ...newBorrowing, [name]: value });
  };

  const handleBookSearchChange = async (e) => {
    const title = e.target.value;
    setBookTitle(title);
    if (title.length > 2) {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/booksearch?query=${title}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookSearchResults(data);
      } else {
        setBookSearchResults([]);
      }
    } else {
      setBookSearchResults([]);
    }
  };

  const handleBookSelect = (book) => {
    setNewBorrowing({ ...newBorrowing, book_id: book.id });
    setBookTitle(book.title);
    setBookSearchResults([]);
  };

  return (
    <div className="min-h-screen flex font-montserrat bg-[#f6f5ff]">
      <Menu />
      <main className="flex-1 pl-[16rem]">
        <TopHeader />
        <div className="p-6">
          <div className="flex justify-left items-center mb-4 gap-4 items-center">
            <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex gap-3 items-center" onClick={() => navigate(-1)}>
              <IoIosArrowBack /> Powrót
            </button>
            <h1 className="text-xl font-bold"> Edytuj czytelnika</h1>
          </div>
          <div className="flex">
            <div className="w-2/5">
              <div className="bg-white shadow-md rounded p-6 h-fit mb-4">
                <div className="flex flex-col items-center mb-4">
                  <div className='w-[140px] h-[140px] rounded-full bg-[#ffffff] mx-auto border-4 border-[#ef4444] mb-5'>
                    <img className="w-[132px] h-[132px] rounded-full mb-4 object-cover" src={user?.profile_picture || '/img/profile-icon-design.jpg'} alt={`${user?.first_name} ${user?.last_name}`} />
                  </div>
                  <h3 className="text-xl font-bold">{user?.first_name} {user?.last_name}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
            </div>
            <div className="w-3/5 bg-white shadow-md rounded p-8 ml-4">
              <div className="mx-auto">
                <div className="flex justify-between items-center mb-4 gap-4 items-center">
                  <h2 className="text-2xl font-bold">Ostatnie wypożyczenia</h2>
                  <button
                    onClick={handleAddBorrowingClick}
                    className="items-center gap-1 py-1.5 px-2.5 flex text-center rounded leading-5 text-gray-100 bg-red-500 border border-red-500 hover:text-white hover:bg-red-600 focus:bg-red-600 focus:outline-none"
                  >
                    Dodaj wypożyczenie <LuBookPlus />
                  </button>
                </div>
                {currentBorrowings.map((borrowing) => (
                  <div key={borrowing.id} className="flex flex-col md:flex-row mb-4 p-4 border rounded">
                    <div className="md:w-1/12 flex justify-center md:justify-start mb-4 md:mb-0">
                      <img className="w-full object-contain" src={borrowing.book?.coverImage || '/img/blank-book-cover-over-png.png'} alt={borrowing.book?.title} />
                    </div>
                    <div className="md:w-11/12 md:pl-4">
                      <h2 className="font-bold text-xl">{borrowing.book?.title}</h2>
                      <p className="text-gray-600">Autor: <strong>{borrowing.book?.author}</strong></p>
                      <p className="text-gray-600">Borrowing Date: <strong>{borrowing.borrowing_date ? new Date(borrowing.borrowing_date).toLocaleDateString() : 'N/A'}</strong></p>
                      <p className="text-gray-600">Return Date: <strong className='bg-green-100 text-green-800 font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300'>{borrowing.realreturndate === "-0001-11-30 00:00:00" ? "Not Returned" : borrowing.realreturndate ? new Date(borrowing.realreturndate).toLocaleDateString() : 'N/A'}</strong></p>
                      <p className="text-gray-600">Comments: <strong>{borrowing.comments || 'No Comments'}</strong></p>
                    </div>
                  </div>
                ))}

                <Pagination
                  borrowingsPerPage={borrowingsPerPage}
                  totalBorrowings={borrowings.length}
                  paginate={paginate}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Modal isOpen={isModalOpen} onClose={handleModalClose} onSave={handleModalSave}>
        <h2 className="text-xl font-bold mb-4">Dodaj wypożyczenie</h2>
        <div className="mb-4 relative">
          <label htmlFor="book_title" className="block mb-2">Book Title:</label>
          <input
            type="text"
            id="book_title"
            name="book_title"
            value={bookTitle}
            onChange={handleBookSearchChange}
            className="w-full p-2 border rounded"
          />
          {bookSearchResults.length > 0 && (
            <ul className="absolute border rounded max-h-48 overflow-y-auto bg-white w-full z-10 rounded-tr-none rounded-tl-none -mt-[2px]">
              {bookSearchResults.map((book) => (
                <li
                  key={book.id}
                  onClick={() => handleBookSelect(book)}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                >
                  {book.title}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="borrowing_date" className="block mb-2">Borrowing Date:</label>
          <input
            type="date"
            id="borrowing_date"
            name="borrowing_date"
            value={newBorrowing.borrowing_date}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="realreturndate" className="block mb-2">Return Date:</label>
          <input
            type="date"
            id="realreturndate"
            name="realreturndate"
            value={newBorrowing.realreturndate}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="comments" className="block mb-2">Comments:</label>
          <textarea
            id="comments"
            name="comments"
            value={newBorrowing.comments}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
      </Modal>
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

export default ReaderdetailsBorrowings;
