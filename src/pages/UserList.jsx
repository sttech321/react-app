import React, { useEffect, useState } from "react";
import { fetchUsers, deleteUser } from "../api/api";
import { toast } from "react-toastify";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Generic fetcher that accepts page & search args (so we can call it directly)
  const fetchUsersData = async (pageArg = 1, limitArg = 10, searchArg = "") => {
    try {
      setLoading(true);
      const { data } = await fetchUsers(pageArg, limitArg, searchArg);
      setUsers(data.data || []);
      if (data.pagination) setTotalPages(data.pagination.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };
  

  // 1) Fetch when page changes (immediate)
  useEffect(() => {
    fetchUsersData(page, 10,searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]); // we intentionally keep it only dependent on page

  // 2) Debounced search: runs when searchTerm changes
  useEffect(() => {
    const delay = 500; // ms — change to 300 if you want snappier searches
    const timer = setTimeout(() => {
      // reset to page 1 for a new search and fetch page 1 results
      setPage(1); // will not immediately reflect in state inside this closure, so fetch directly with 1
      fetchUsersData(1, 10,  searchTerm);
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
        fetchUsersData(page, searchTerm);
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user");
    }
  };

  const handleAddUser = () => {
    alert("Add user form coming soon!");
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
        <input
          type="search"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center space-x-4">
          <div className="text-gray-700">
            Showing {users.length} {users.length === 1 ? "user" : "users"}
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
                    <button className="text-blue-600 hover:underline mr-3">Edit</button>
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
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No users found.
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
    </div>
  );
}

export default UserList;
