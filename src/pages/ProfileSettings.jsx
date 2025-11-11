import React, { useState, useContext, useEffect } from "react";
import { updateProfile, changePassword } from "../api/api"; // API function
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("zuzu@yopmail.com");
  const [passwords, setPasswords] = useState({
    "Current Password": "",
    "New Password": "",
    "Confirm Password"  : "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { update, user } = useContext(UserContext);
  const navigate = useNavigate();

    useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setProfileImage(user.avatar ? user.avatar : null);
    }
  }, [user]);

  

  // ✅ Automatically upload profile image on change
   const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // ✅ Show preview
      setProfileImage(URL.createObjectURL(file));

      // ✅ Get stored token
      const token = localStorage.getItem("auth_token");

      // ✅ Create FormData properly
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("profileImage", file); // must match backend field name

      console.log("FormData prepared for upload:", [...formData.entries()]); // debug

      try {
        setLoading(true);
        const data = await updateProfile(token, formData);
        console.log("Profile update response:", data);

        if (data?.success) {
          update(data.user);
          toast.success("Profile image updated successfully!");
        } else {
          toast.error(data.message || "Failed to update image.");
        }
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("Error uploading image.");
      } finally {
        setLoading(false);
      }
    };



  // ✅ Handle profile info update
  const handleProfileSave = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");

      // ✅ Use FormData to include both image + text fields
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);

      // ✅ If user selected a new image, append it
      if (setProfileImage) {
        formData.append("profileImage", setProfileImage);
      }

      // console.log("Submitting profile update:", [...formData.entries()]);
      const data = await updateProfile(token, formData);
   //   console.log("Profile update response:", data);

      if (data?.success) {
        update(data?.user);
        toast.success("Profile updated successfully!");
        //navigate("/dashboard");
      } else {
        toast.error(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (passwords["New Password"] !== passwords["Confirm Password"]) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Attempting to change password with:", passwords);
    try {
      const res = await changePassword({
        currentPassword: passwords["Current Password"],
        newPassword: passwords["New Password"],
        confirmPassword: passwords["Confirm Password"],
      });

      if (res.success) {
         toast.success("Password updated successfully!");
         setPasswords({
          "Current Password": "",
          "New Password": "",
          "Confirm Password": "",
        });
      } else {
        toast.error(res.error || "Failed to update password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Something went wrong. Please try again.");
  }

  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      alert("Account deleted successfully!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-2">Settings</h2>
      <p className="text-gray-500 mb-6">
        Manage your profile and account settings
      </p>

      {/* Tabs */}
      <div className="flex border-b">
        {["profile", "password", "appearance"].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 capitalize border-b-2 transition ${
              activeTab === tab
                ? "border-black text-black font-medium"
                : "border-transparent text-gray-500 hover:text-black"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <form onSubmit={handleProfileSave} className="mt-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">Profile</h3>
            <p className="text-gray-500">
              Update your name, email, and picture
            </p>
          </div>

          {/* Profile Image */}
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
              {user?.avatar ? (
                // ✅ Show new preview if available
                <img
                  src={`http://localhost:5000${user.avatar}`}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : profileImage ? (
                // ✅ Otherwise show existing avatar from backend
                <img
                  src={profileImage}
                  alt="Current Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                // ✅ If no image at all
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
            </div>

            <div>
              <label className="cursor-pointer text-blue-600 hover:underline">
                Upload new
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              {loading && <p className="text-gray-500 text-sm mt-1">Uploading...</p>}
            </div>
          </div>


          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full border rounded px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            {loading ? "Saving..." : "Save"}
          </button>

          {message && <p className="text-green-600 pt-2">{message}</p>}

          {/* Delete Account */}
          {/* <div className="pt-6 border-t">
            <h4 className="font-medium text-red-600 mb-2">Delete account</h4>
            <p className="text-gray-500 mb-3">
              Delete your account and all of its resources
            </p>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded"
            >
              Delete account
            </button>
          </div> */}
        </form>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <form onSubmit={handlePasswordReset} className="mt-6 space-y-6">
          <div>
            <h3 className="text-lg font-medium">Password</h3>
            <p className="text-gray-500">Change your current password</p>
          </div>

          {["Current Password", "New Password", "Confirm Password"].map((key) => (
            <div key={key}>
              <label className="block mb-1 font-medium capitalize">
                {key}
              </label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                value={passwords[key]}
                onChange={(e) =>
                  setPasswords({ ...passwords, [key]: e.target.value })
                }
              />
            </div>
          ))}

          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            Update Password
          </button>
        </form>
      )}

      {/* Appearance Tab */}
      {activeTab === "appearance" && (
        <div className="mt-6 space-y-3">
          <h3 className="text-lg font-medium">Appearance</h3>
          <p className="text-gray-500">Customize your theme (coming soon)</p>
        </div>
      )}
    </div>
  );
}
