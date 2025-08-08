import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import React, { useState } from "react";
import Resizer from "react-image-file-resizer";
import { set, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import api from "../../api/axios";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

export default function AvatarUploadModal({ open, onClose, userData }) {
  // Validation Schema
  const schema = Yup.object().shape({
    avatar: Yup.mixed()
      .required("Avatar is required")
      .test(
        "fileSize",
        "File is too large. Max size is 2MB.",
        (value) => value && value.size <= 2048000
      )
      .test(
        "fileType",
        "Only .jpeg, .jpg, and .png files are allowed",
        (value) =>
          value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
      ),
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Resizing image file
  const resizeFile = (file, width = 180, height = 180) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        width,
        height,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri); // Resolves the resized image
        },
        "blob" // Output format as a Blob (ready for upload)
      );
    });

  // Handling avatar upload
  const uploadAvatar = async (formData) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await api.post("/update/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      enqueueSnackbar("Failed to upload avatar. Please try again.", {
        variant: "error",
      });
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      setLoading(false);
      enqueueSnackbar("Avatar updated successfully!", { variant: "success" });
    }
  };

  // Submitting the form
  const onSubmit = async (data) => {
    const formData = new FormData();
    const resizedAvatar = await resizeFile(data.avatar); // Resize before upload
    formData.append("avatar", resizedAvatar); // Add resized avatar
    await uploadAvatar(formData); // Upload avatar
  };

  // Handle file change for preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("avatar", file); // Set file in react-hook-form state
      setPreview(URL.createObjectURL(file)); // Set preview image
    }
  };

  return (
    <Modal keepMounted open={open} onClose={onClose}>
      <ModalDialog className="">
        <DialogTitle className="justify-center">My Profile</DialogTitle>
        <DialogContent>
          {/* details section */}

          <div className="flex justify-center">
            <div className="w-full mx-auto md:my-2 bg-white rounded-lg p-5">
              <div
                className="relative w-32 h-32 mx-auto rounded-full hover:cursor-pointer"
                onClick={() => setShow(!show)}
              >
                {/* The image */}
                <img
                  className="w-full h-full object-cover rounded-full border-2 border-primary-green  hover:border-none"
                  src={userData?.avatar}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-30 transition-opacity duration-300 ease-in-out rounded-full">
                  <div className="text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <FontAwesomeIcon className="text-2xl" icon={faCamera} />
                  </div>
                </div>
              </div>
              <h2 className="text-center text-2xl font-semibold mt-3">
                {userData?.name}
              </h2>
              <h2 className="overflow-auto text-sm font-normal mt-3">
                {userData?.email}
              </h2>
            </div>
          </div>

          {/* Upload section */}
          {show && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 w-full px-5 py-3"
            >
              <div className="text-center">
                <div className="flex w-full h-full items-center justify-center bg-grey-lighter mb-2">
                  <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:scale-105 transition-transform duration-300 ease-in-out">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                    <span className="mt-2 text-base leading-normal">
                      Select a file
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className={`hidden ${
                        errors.avatar ? "border-red-500" : ""
                      }`}
                    />
                  </label>
                </div>

                {errors.avatar && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.avatar.message}
                  </p>
                )}
              </div>

              {preview && (
                <div className="flex justify-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="rounded-full w-[80px] h-[80px] md:w-[100px] md:h-[100px] object-cover"
                  />
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="text-sm md-text-lg bg-secondary-green text-white py-2 px-3 rounded-[4px] hover:bg-inherit hover:text-secondary-green hover:border hover:border-secondary-green transition"
                >
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </ModalDialog>
    </Modal>
  );
}
