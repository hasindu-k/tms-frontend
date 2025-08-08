import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import { enqueueSnackbar } from "notistack";

const ProfileUpdate = () => {
  const [preview, setPreview] = useState(null);

  const validationSchema = Yup.object().shape({
    name: Yup.string(),
    avatar: Yup.mixed(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Handle form submission
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("avatar", data.avatar[0]); // avatar file

    try {
      const token = Cookies.get("access_token");
      await axios.post("/api/profile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      enqueueSnackbar("Profile updated successfully!", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Failed to update profile", { variant: "error" });
    }
  };

  // Handle file preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Update Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            {...register("name")}
            className={`block w-full px-4 py-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none`}
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          <input
            type="file"
            {...register("avatar")}
            accept="image/*"
            onChange={handleFileChange}
            className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
              errors.avatar ? "border-red-500" : "border-gray-300"
            }`}
          />
          {preview && (
            <img
              src={preview}
              alt="Profile Preview"
              className="mt-4 h-32 w-32 rounded-full object-cover"
            />
          )}
          {errors.avatar && (
            <p className="text-red-500 text-sm mt-1">{errors.avatar.message}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileUpdate;
