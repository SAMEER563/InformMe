import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { app } from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserFailure,
  deleteUserSuccess,
  signoutSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);

  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [formdata, setFormdata] = useState({});
  const filePickerRef = useRef();
  const dispatch = useDispatch();

  // Image Picker
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) uploadImage();
  }, [imageFile]);

  // Upload to Firebase
  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);

    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      () => {
        setImageFileUploadError("Could not upload image (File must be less than 2MB)");
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormdata({ ...formdata, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.id]: e.target.value });
  };

  // Update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formdata).length === 0) {
      setUpdateUserError("Please update at least one field");
      return;
    }

    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Profile updated successfully!");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  // Delete account
  const handleDeleteUser = async () => {
    setShowModal(false);

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess());
        setUpdateUserSuccess(data.message);
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // Signout
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" });
      const data = await res.json();

      if (res.ok) dispatch(signoutSuccess());
    } catch (error) {
      console.log(error.message);
    }
  };

return (
  <div className="flex justify-center items-start w-full mt-10">
    <div className="w-full max-w-3xl bg-white shadow-md rounded-xl p-6">

      {/* ----- TITLE ----- */}
      <h1 className="text-center font-semibold text-2xl text-green-700 mb-6">
        Profile
      </h1>

    {/* HORIZONTAL WRAPPER */}
    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

      {/* LEFT — PROFILE IMAGE */}
      <div
        className="relative w-32 h-32 cursor-pointer shadow-md overflow-hidden rounded-full border-4 border-green-200 hover:scale-105 transition duration-300"
        onClick={() => filePickerRef.current.click()}
      >
        <input type="file" hidden ref={filePickerRef} accept="image/*" onChange={handleImageChange} />

        {imageFileUploadProgress && (
          <CircularProgressbar
            value={imageFileUploadProgress}
            text={`${imageFileUploadProgress}%`}
            strokeWidth={6}
            styles={{
              path: { stroke: `rgba(16,185,129, ${imageFileUploadProgress / 100})` },
              text: { fill: "#16a34a", fontWeight: "bold" },
            }}
          />
        )}

        <img
          src={imageFileUrl || currentUser.profilePicture}
          alt="user"
          className={`w-full h-full object-contain rounded-full transition ${
            imageFileUploadProgress && imageFileUploadProgress < 100 ? "opacity-60" : ""
          }`}
        />
      </div>

      {/* RIGHT — FORM */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col gap-4 w-full"
      >
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          className="focus:ring-green-500"
        />

        <TextInput
          type="email"
          id="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          onChange={handleChange}
          className="focus:ring-green-500"
        />

        <TextInput
          type="password"
          id="password"
          placeholder="New Password"
          onChange={handleChange}
          className="focus:ring-green-500"
        />

        <Button
          type="submit"
          color="success"
          disabled={loading || imageFileUploading}
          className="w-full mt-1"
        >
          {loading ? "Updating..." : "Update Profile"}
        </Button>

        {/* Delete + Sign out */}
        <div className="text-red-500 flex justify-between mt-1 text-sm">
          <span className="cursor-pointer hover:text-red-700" onClick={() => setShowModal(true)}>
            Delete Account
          </span>
          <span className="cursor-pointer hover:text-red-700" onClick={handleSignout}>
            Sign Out
          </span>
        </div>

        {/* Alerts */}
        {updateUserSuccess && (
          <Alert color="success" className="mt-2">
            {updateUserSuccess}
          </Alert>
        )}
        {updateUserError && (
          <Alert color="failure" className="mt-2">
            {updateUserError}
          </Alert>
        )}
        {error && (
          <Alert color="failure" className="mt-2">
            {error}
          </Alert>
        )}
      </form>
    </div>

    {/* MODAL */}
    <Modal show={showModal} onClose={() => setShowModal(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center p-4">
          <HiOutlineExclamationCircle className="h-14 w-14 text-green-500 mx-auto mb-2" />
          <h3 className="mb-4 text-lg text-gray-600">
            Are you sure you want to delete your account?
          </h3>

          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteUser}>
              Yes, Delete
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  </div>
  </div>
);


}
