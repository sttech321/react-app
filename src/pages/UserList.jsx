import React, { useEffect, useState } from "react";
import { fetchUsers, deleteUser, createUser, updateUser } from "../api/api";
import { toast } from "react-toastify";
import UserModal from "../components/UserModal";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Generic fetcher that accepts page & search args (so we can call it directly)
  const fetchUsersData = async (pageArg = 1, limitArg = 10, searchArg = "") => {
    try {
      if (searchArg) {
        setSearching(true);
      } else {
        setLoading(true);
      }
      const { data } = await fetchUsers(pageArg, searchArg, limitArg);
      setUsers(data.data || []);
      if (data.pagination) setTotalPages(data.pagination.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };
  

  // 1) Fetch when page changes (immediate)
  useEffect(() => {
    fetchUsersData(page, 10,searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); // we intentionally keep it only dependent on page

  // 2) Debounced search: runs when searchTerm changes
  useEffect(() => {
    const delay = 400; // ms — faster debounce
    const timer = setTimeout(() => {
      // reset to page 1 for a new search and fetch page 1 results
      setPage(1); // will not immediately reflect in state inside this closure, so fetch directly with 1
      fetchUsersData(1, 10, searchTerm);
    }, delay);

    return () => clearTimeout(timer); // cancel previous timer on rapid input
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]); // only depends on searchTerm

  const handleDeleteUser = async (userId) => {
    try {
      const response = await deleteUser(userId);
      if (response?.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        toast.success("User deleted successfully");
        // refetch current page to get fresh pagination if needed
        fetchUsersData(page, 10, searchTerm);
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user");
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmitUser = async (formData) => {
    try {
      setModalLoading(true);
      
      if (editingUser) {
        // Update existing user
        const response = await updateUser(editingUser._id, formData);
        if (response?.success) {
          toast.success("User updated successfully!");
          handleCloseModal();
          // Refresh user list
          fetchUsersData(page, 10, searchTerm);
        } else {
          toast.error(response.error || "Failed to update user");
        }
      } else {
        // Create new user
        const response = await createUser(formData);
        if (response?.success) {
          toast.success("User created successfully!");
          handleCloseModal();
          // Refresh user list
          fetchUsersData(page, 10, searchTerm);
        } else {
          toast.error(response.error || "Failed to create user");
        }
      }
    } catch (error) {
      console.error("Error submitting user:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-800 text-lg">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 py-10 px-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Users List</h2>

      {/* Top bar: search left, add button right */}
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-1/3">
          <input
            type="search"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value.trimStart())}
            className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* Search Icon */}
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {/* Clear button */}
          {searchTerm && !searching && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {/* Searching indicator */}
          {searching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-gray-700">
            {searchTerm ? (
              <span>
                Found <strong>{users.length}</strong> {users.length === 1 ? "result" : "results"}
              </span>
            ) : (
              <span>Showing {users.length} {users.length === 1 ? "user" : "users"}</span>
            )}
          </div>

          <button
            onClick={handleAddUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            + Add User
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-700">#</th>
              <th className="px-4 py-3 text-left text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-gray-700">Phone</th>
              <th className="px-4 py-3 text-left text-gray-700">Avatar</th>
              <th className="px-4 py-3 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user._id || index}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">{index + 1 + (page - 1) * 10}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No Image</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button 
                      className="text-blue-600 hover:underline mr-3"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-500">
                  {searchTerm ? (
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <p className="text-lg font-medium text-gray-700">No results found for "{searchTerm}"</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your search</p>
                    </div>
                  ) : (
                    "No users found."
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center py-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded mr-2 ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-700 mx-2">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded ${
              page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitUser}
        user={editingUser}
        isLoading={modalLoading}
      />
    </div>
  );
}

export default UserList;
