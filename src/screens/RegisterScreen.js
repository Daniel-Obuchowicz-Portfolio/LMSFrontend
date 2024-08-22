import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    date_of_birth: '',
    gender: '',
    phone_number: '',
    address: '',
    city: '',
    country: '',
    postal_code: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    let formErrors = {};

    if (!formData.first_name.trim()) {
      formErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      formErrors.last_name = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      formErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      formErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      formErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      formErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.date_of_birth) {
      formErrors.date_of_birth = 'Date of Birth is required';
    }
    
    if (!formData.gender) {
      formErrors.gender = 'Gender is required';
    }

    if (!formData.phone_number.trim()) {
      formErrors.phone_number = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone_number)) {
      formErrors.phone_number = 'Phone number is invalid';
    }

    if (!formData.address.trim()) {
      formErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      formErrors.city = 'City is required';
    }

    if (!formData.country.trim()) {
      formErrors.country = 'Country is required';
    }

    if (!formData.postal_code.trim()) {
      formErrors.postal_code = 'Postal Code is required';
    } else if (!/^\d{5,10}$/.test(formData.postal_code)) {
      formErrors.postal_code = 'Postal Code is invalid';
    }
    
    return formErrors;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTermsChange = (e) => {
    setAcceptTerms(e.target.checked);
  };

  const handleTermsClick = () => {
    Swal.fire({
      title: 'Terms and Conditions',
      text: 'Here you can add the text of your terms and conditions. Make sure it is detailed and clear for your users.',
      icon: 'info',
      confirmButtonText: 'Close',
      width: '600px',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (!acceptTerms) {
      Swal.fire({
        icon: 'warning',
        title: 'Terms and Conditions',
        text: 'You must accept the terms and conditions to register.',
        confirmButtonText: 'OK'
      });
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'Your account has been created successfully!',
        confirmButtonText: 'OK'
      });
      navigate('/login');
    } else {
      setErrors({ apiError: 'Registration failed. Please try again.' });
    }
  };

  return (
    <div className="font-montserrat min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-lg">
        <div className="text-center">
          <img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <a href="#" onClick={() => navigate('/login')} className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in.
            </a>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.apiError && <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:text-red-400">{errors.apiError}</div>}
          <div className="rounded-md shadow-sm">
            <div className="mb-5">
              <label htmlFor="first_name" className="sr-only">First Name</label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                required
                value={formData.first_name}
                onChange={handleChange}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="First Name"
              />
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
            </div>
            <div className="mb-5">
              <label htmlFor="last_name" className="sr-only">Last Name</label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                required
                value={formData.last_name}
                onChange={handleChange}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Last Name"
              />
              {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
            </div>
            <div className="mb-5">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="mb-5">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Password"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div className="mb-5">
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            <div className="mb-5">
              <label htmlFor="date_of_birth" className="sr-only">Date of Birth</label>
              <input
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                required
                value={formData.date_of_birth}
                onChange={handleChange}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.date_of_birth ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              />
              {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
            </div>
            <div className="mb-5">
              <label htmlFor="gender" className="sr-only">Gender</label>
              <select
                id="gender"
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>
            <div className="mb-5">
              <label htmlFor="phone_number" className="sr-only">Phone Number</label>
              <input
                id="phone_number"
                name="phone_number"
                type="text"
                value={formData.phone_number}
                onChange={handleChange}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.phone_number ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Phone Number"
              />
              {errors.phone_number && <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>}
            </div>
            <div className="mb-5">
              <label htmlFor="address" className="sr-only">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className={`appearance-none rounded-b-md relative block w-full px-3 py-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Address"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            <div className="mb-5">
              <label htmlFor="city" className="sr-only">City</label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="City"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
            <div className="mb-5">
              <label htmlFor="country" className="sr-only">Country</label>
              <input
                id="country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Country"
              />
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
            </div>
            <div className="mb-5">
              <label htmlFor="postal_code" className="sr-only">Postal Code</label>
              <input
                id="postal_code"
                name="postal_code"
                type="text"
                value={formData.postal_code}
                onChange={handleChange}
                className={`appearance-none rounded-md relative block w-full px-3 py-2 border ${errors.postal_code ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                placeholder="Postal Code"
              />
              {errors.postal_code && <p className="text-red-500 text-xs mt-1">{errors.postal_code}</p>}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center mb-4">
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              checked={acceptTerms}
              onChange={handleTermsChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
              I accept the <span onClick={handleTermsClick} className="text-indigo-600 hover:text-indigo-500 cursor-pointer">terms and conditions.</span>
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
