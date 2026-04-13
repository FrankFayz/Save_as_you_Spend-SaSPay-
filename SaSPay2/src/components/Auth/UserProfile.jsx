import React, { useState } from "react";
import "./Auth.css";

const UserProfile = ({ user, onBack, onUpdateUser }) => {
  const [username, setUsername] = useState(user?.username || "");
  const [profilePicture, setProfilePicture] = useState(user?.profile_picture || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [imageFileName, setImageFileName] = useState("");

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert("Username is required");
      return;
    }

    setLoading(true);

    const updateData = {
      phone: user.phone,
      username: username.trim(),
      profile_picture: profilePicture || null
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/update-profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");
        onUpdateUser(data.user);
        onBack();
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    const passwordData = {
      phone: user.phone,
      old_password: oldPassword,
      new_password: newPassword
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/change-password/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(passwordData)
      });

      const data = await response.json();

      if (response.ok) {
        alert("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error(error);
      alert("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <h2>User Profile</h2>
        </div>

        <div className="profile-tabs">
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile Settings
          </button>
          <button
            className={activeTab === "password" ? "active" : ""}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </button>
        </div>

        {activeTab === "profile" && (
          <form onSubmit={handleProfileUpdate} className="auth-form">
            <div className="profile-picture-section">
              <img
                src={profilePicture || "https://img.icons8.com/fluency/96/user-male-circle.png"}
                alt="Profile"
                className="profile-preview"
              />
              <label htmlFor="profile-image-input" className="image-upload-label">
                Choose image
              </label>
              <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                className="image-file-input"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setImageFileName(file.name);
                  const reader = new FileReader();
                  reader.onload = () => {
                    setProfilePicture(reader.result || "");
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </div>

            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                value={user?.phone || ""}
                disabled
                className="disabled-input"
              />
              <small style={{ color: "#666" }}>Phone number cannot be changed</small>
            </div>

            <button type="submit" disabled={loading} className="auth-btn">
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        )}

        {activeTab === "password" && (
          <form onSubmit={handlePasswordChange} className="auth-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>

            <button type="submit" disabled={loading} className="auth-btn">
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;