import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Menu from '../components/Header';
import TopHeader from '../components/TopHeader';
import Swal from 'sweetalert2';
import { IoIosArrowBack } from "react-icons/io";
import { MdArrowForwardIos } from "react-icons/md";

const ReaderdetailsBorrowings = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [borrowings, setBorrowings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
                <h2 className="text-2xl font-bold mb-4">Ostatnie wypożyczenia</h2>
                {borrowings.map((borrowing) => (
                    <div key={borrowing.id} className="flex flex-col md:flex-row mb-4 p-4 border rounded">
                      <div className="md:w-2/12 flex justify-center md:justify-start mb-4 md:mb-0">
                        <img className="w-full object-cover" src={borrowing.book.coverImage || '/img/blank-book-cover-over-png.png'} alt={borrowing.book.title} />
                      </div>
                      <div className="md:w-10/12 md:pl-4">
                        <h2 className="font-bold text-2xl mb-3">{borrowing.book.title}</h2>
                        <p className="text-gray-600 mb-1">Autor: <strong>{borrowing.book.author}</strong></p>
                        <p className="text-gray-600 mb-1">Borrowing Date: <strong>{new Date(borrowing.borrowing_date.date).toLocaleDateString()}</strong></p>
                        <p className="text-gray-600 mb-1">Return Date: <strong className='bg-green-100 text-green-800 font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300'>{borrowing.realreturndate.date === "-0001-11-30 00:00:00.000000" ? "Not Returned" : new Date(borrowing.realreturndate.date).toLocaleDateString()}</strong></p>
                        <p className="text-gray-600 mb-1">Comments: <strong>{borrowing.comments || 'No Comments'}</strong></p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReaderdetailsBorrowings;
