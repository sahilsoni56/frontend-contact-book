import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import ToastContext from "../context/ToastContext";
import Cookies from "js-cookie"; 

const CreateContact = () => {
  const { toast } = useContext(ToastContext);

  const [userDetails, setUserDetails] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    phone_number_1: "",
    phone_number_2: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); 
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true); 
    
    const token = Cookies.get("token"); 

    if (!token) {
      toast.error("You need to log in first.");
      navigate("/login"); 
      setIsSubmitting(false); 
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(userDetails),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(
          `Contact for ${userDetails.first_name} ${userDetails.last_name} created successfully.`
        );
        setUserDetails({
          first_name: "",
          middle_name: "",
          last_name: "",
          email: "",
          phone_number_1: "",
          phone_number_2: "",
          address: "",
        });
        navigate("/home", { replace: true });
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (err) {
      toast.error("Error creating contact. Please try again.");
      console.log(err);
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700">Create a New Contact</h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="flex gap-4">
          <div className="w-[48%]">
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-600">
              First Name
            </label>
            <input
              type="text"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              id="first_name"
              name="first_name"
              value={userDetails.first_name}
              onChange={handleInputChange}
              placeholder="John"
              required
            />
          </div>

          <div className="w-[48%]">
            <label htmlFor="middle_name" className="block text-sm font-medium text-gray-600">
              Middle Name (Optional)
            </label>
            <input
              type="text"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              id="middle_name"
              name="middle_name"
              value={userDetails.middle_name}
              onChange={handleInputChange}
              placeholder="Optional"
            />
          </div>
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-600">
            Last Name
          </label>
          <input
            type="text"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
            id="last_name"
            name="last_name"
            value={userDetails.last_name}
            onChange={handleInputChange}
            placeholder="Doe"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email Address
          </label>
          <input
            type="email"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
            id="email"
            name="email"
            value={userDetails.email}
            onChange={handleInputChange}
            placeholder="johndoe@example.com"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="w-[48%]">
            <label htmlFor="phone_number_1" className="block text-sm font-medium text-gray-600">
              Primary Phone Number
            </label>
            <input
              type="tel"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              id="phone_number_1"
              name="phone_number_1"
              value={userDetails.phone_number_1}
              onChange={handleInputChange}
              placeholder="+977 987654321"
              required
            />
          </div>

          <div className="w-[48%]">
            <label htmlFor="phone_number_2" className="block text-sm font-medium text-gray-600">
              Secondary Phone Number
            </label>
            <input
              type="tel"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
              id="phone_number_2"
              name="phone_number_2"
              value={userDetails.phone_number_2}
              onChange={handleInputChange}
              placeholder="+977 987654322"
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-600">
            Address
          </label>
          <input
            type="text"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
            id="address"
            name="address"
            value={userDetails.address}
            onChange={handleInputChange}
            placeholder="WalkStreet 05, California"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting} 
          className={`w-full py-2 mt-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Submitting..." : "Add Contact"}
        </button>
      </form>
    </div>
  );
};

export default CreateContact;
