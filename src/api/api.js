import API from "./axiosInstance";

// 🟩 Register User
export const registerUser = async (userData) => {
  try {    const { data } = await API.post("/users/register", userData);

    return { success: true, data };
  } catch (error) {
    console.error("Register error:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

// 🟩 Login User
export const loginUser = async (userData) => {
  try {
    const { data } = await API.post("/users/login", userData);
    return { success: true, data };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

// 🟩 Get User Profile
export const getProfile = async () => {
  try {
    const { data } = await API.get("/users/profile");
    return { success: true, data };
  } catch (error) {
    console.error("Get profile error:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

// 🟩 Update User Profile (with FormData)
export const updateProfile = async (token, formData) => {
  try {
    // debug: print FormData entries
    for (let [key, value] of formData.entries()) {
      console.log(`FormData → ${key}:`, value instanceof File ? value.name : value);
    }

    // axios response
    const response = await API.put("/users/updateProfile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    // response.data is the server body
    const respBody = response?.data ?? {};

    console.log("✅ Raw server response body:", respBody);
 
    const inner = respBody.data ?? respBody;  
    const user = inner?.user ?? null;
    const message =
      inner?.message ?? respBody?.message ?? "Profile updated";

    return {
      success: Boolean(respBody.success),
      user,
      message,
      raw: respBody, // optional: caller can inspect full body if needed
    };
  } catch (error) {
    console.error("🚨 Profile update error:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || "Network or server error",
    };
  }
};



// 🟩 Delete Account
export const deleteAccount = async () => {
  try {
    const { data } = await API.delete("/users/delete");
    return { success: true, data };
  } catch (error) {
    console.error("Delete account error:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};


export const changePassword = async (passwords) => {
 
  try {
    const { data } = await API.put("/users/changePassword", passwords);
    console.log("Change password response:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Change password error:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};


export const fetchUsers = async (page = 1, searchTerm = "", limit = 10) => {
  try {
    const { data } = await API.get("/users/usersList", {
      params: { page, limit, search: searchTerm },   // backend expects 'search' not 'searchTerm'
    });
    return { success: true, data };
  } catch (error) {
    console.error("Fetch users error:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

export const deleteUser = async (userId) => {
  try {
    console.log("Deleting user with ID:", userId);
    const { data } = await API.delete(`/users/deleteUser/${userId}`); 
    return { success: true, data };
  } catch (error) {
    console.error("Delete user error:", error);
    return {  
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

export const createUser = async (userData) => {
  try {
    const { data } = await API.post("/users/createUser", userData);
    return { success: true, data };
  } catch (error) {
    console.error("Create user error:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const { data } = await API.put(`/users/updateUser/${userId}`, userData);
    return { success: true, data };
  } catch (error) {
    console.error("Update user error:", error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};


