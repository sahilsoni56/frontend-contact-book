import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ToastContext from "../context/ToastContext";
import Cookies from "js-cookie"; 

const AllContact = () => {
  const { toast } = useContext(ToastContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({});
  const [contacts, setContacts] = useState([]);
  const [allContacts, setAllContacts] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);

      const token = Cookies.get("token");
      if (!token) {
        toast.error("You need to login first.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/contacts?page=1&limit=10`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (!result.error) {
          if (Array.isArray(result)) {
            setAllContacts(result);
            setContacts(result);
          } else {
            toast.error("Contacts data is not in the expected format.");
          }
        } else {
          toast.error(result.error || "Failed to fetch contacts.");
        }
      } catch (err) {
        toast.error("Error occurred while fetching contacts.");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [toast, navigate]);


  const deleteContact = async (id) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("You need to login first.");
      navigate("/login");
      return;
    }

    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/contacts/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();
        if (!result.error) {
          setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
          setAllContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
          toast.success("Contact deleted successfully.");
          setShowModal(false);
        } else {
          toast.error(result.error || "Failed to delete contact.");
        }
      } catch (err) {
        toast.error("Error occurred while deleting contact.");
      }
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    const filteredContacts = allContacts.filter(
      (contact) =>
        contact.first_name.toLowerCase().includes(searchInput.toLowerCase()) ||
        contact.last_name.toLowerCase().includes(searchInput.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchInput.toLowerCase())
    );
    setContacts(filteredContacts);
  };

  return (
    <>
      <div className="p-1">
        <h1 className="text-xl font-semibold">Your Contacts</h1>

        <hr className="my-2" />
        {loading ? (
          <div>Loading Contacts...</div>
        ) : (
          <>
            {contacts.length === 0 ? (
              <h3 className="text-lg">No contacts found</h3>
            ) : (
              <>
                <form className="d-flex mb-4" onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    name="searchInput"
                    id="searchInput"
                    className="form-control my-2 p-2 w-full sm:w-64"
                    placeholder="Search Contact"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn-info rounded-md mx-2  bg-[#612D3A] text-[#CACEB8]"
                  >
                    Search
                  </button>
                </form>

                <p className="font-bold">
                  Your Total Contacts: <strong>{contacts.length}</strong>
                </p>
                <table className="table table-hover bg-transparent w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th scope="col" className="px-4 py-2">
                        FirstName
                      </th>
                      <th scope="col" className="px-4 py-2">
                        Address
                      </th>
                      <th scope="col" className="px-4 py-2">
                        Email
                      </th>
                      <th scope="col" className="px-4 py-2">
                        Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setModalData(contact);
                          setShowModal(true);
                        }}
                      >
                        <th scope="row" className="px-4 py-2">
                          {contact.first_name}
                        </th>
                        <td className="px-4 py-2">{contact.address}</td>
                        <td className="px-4 py-2">{contact.email}</td>
                        <td className="px-4 py-2">{contact.phone_number_1}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h3 className="text-xl">{modalData.name}</h3>
          <p>
            <strong>First Name</strong>: {modalData.first_name}
          </p>
          <p>
            <strong>Middle Name</strong>: {modalData.middle_name}
          </p>
          <p>
            <strong>Last Name</strong>: {modalData.last_name}
          </p>
          <p>
            <strong>Address</strong>: {modalData.address}
          </p>
          <p>
            <strong>Email</strong>: {modalData.email}
          </p>
          <p>
            <strong>Phone Number 1</strong>: {modalData.phone_number_1}
          </p>
          <p>
            <strong>Phone Number 2</strong>: {modalData.phone_number_2}
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Link className="btn btn-info py-2 px-4" to={`/edit/${modalData.id}`}>
            Edit
          </Link>
          <button className="btn btn-danger py-2 px-4" onClick={() => deleteContact(modalData.id)}>
            Delete
          </button>
          <button className="btn btn-warning py-2 px-4" onClick={() => setShowModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AllContact;
