import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ToastContext from "../context/ToastContext";

const EditContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useContext(ToastContext);

  const [userDetails, setUserDetails] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    address: "",
    email: "",
    phone_number_1: "",
    phone_number_2: "",
  });

  const [loading, setLoading] = useState(true);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const getToken = () => {
    return document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = getToken();

    try {
      const res = await fetch(`http://localhost:5000/api/contacts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userDetails),
      });
      const result = await res.json();

      if (!result.error) {
        toast.success(`Updated contact for ${userDetails.first_name} ${userDetails.last_name}`);
        setUserDetails({
          first_name: "",
          middle_name: "",
          last_name: "",
          address: "",
          email: "",
          phone_number_1: "",
          phone_number_2: "",
        });
        navigate("/mycontacts");
      } else {
        toast.error(result.error || "Error updating contact");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchContact = async () => {
      const token = getToken();

      try {
        const res = await fetch(`http://localhost:5000/api/contacts/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();

        if (res.ok) {
          setUserDetails({
            first_name: result.first_name,
            middle_name: result.middle_name,
            last_name: result.last_name,
            address: result.address,
            email: result.email,
            phone_number_1: result.phone_number_1,
            phone_number_2: result.phone_number_2,
          });
        } else {
          toast.error(result.error || "Error fetching contact details");
        }
      } catch (err) {
        console.log(err);
        toast.error("Error fetching contact details");
      }
      setLoading(false);
    };

    fetchContact();
  }, [id, toast]);

  return (
    <div className="max-w-xl mx-auto p-3 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-700">Edit your contact</h2>

      {loading ? (
        <div className="text-center text-gray-500">Loading contact details...</div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="flex gap-2 w-full">
            <div className="w-[50%]">
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-600">
                First Name
              </label>
              <input
                type="text"
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#612D3A]"
                id="first_name"
                name="first_name"
                value={userDetails.first_name}
                onChange={handleInputChange}
                placeholder="John"
                required
              />
            </div>

            <div className="w-[50%]">
              <label htmlFor="middle_name" className="block text-sm font-medium text-gray-600">
                Middle Name
              </label>
              <input
                type="text"
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#612D3A]"
                id="middle_name"
                name="middle_name"
                value={userDetails.middle_name}
                onChange={handleInputChange}
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-600">
              Last Name
            </label>
            <input
              type="text"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#612D3A]"
              id="last_name"
              name="last_name"
              value={userDetails.last_name}
              onChange={handleInputChange}
              placeholder="Smith"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-600">
              Address
            </label>
            <input
              type="text"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#612D3A]"
              id="address"
              name="address"
              value={userDetails.address}
              onChange={handleInputChange}
              placeholder="123 Main St, City"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#612D3A]"
              id="email"
              name="email"
              value={userDetails.email}
              onChange={handleInputChange}
              placeholder="johndoe@example.com"
              required
            />
          </div>

          <div className="gap-2 flex w-full">
            <div className="w-[50%]">
              <label htmlFor="phone_number_1" className="block text-sm font-medium text-gray-600">
                Phone Number 1
              </label>
              <input
                type="text"
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#612D3A]"
                id="phone_number_1"
                name="phone_number_1"
                value={userDetails.phone_number_1}
                onChange={handleInputChange}
                placeholder="9876543210"
                required
              />
            </div>

            <div className="w-[50%]">
              <label htmlFor="phone_number_2" className="block text-sm font-medium text-gray-600">
                Phone Number 2
              </label>
              <input
                type="text"
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#612D3A]"
                id="phone_number_2"
                name="phone_number_2"
                value={userDetails.phone_number_2}
                onChange={handleInputChange}
                placeholder="9876543210"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-[#612D3A] text-[#CACEB8] font-semibold rounded-md hover:bg-[#431c26]"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default EditContact;
