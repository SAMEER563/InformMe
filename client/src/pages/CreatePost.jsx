import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    image: ''
  });
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  // Upload image to Firebase
  const handleUploadImage = () => {
    if (!file) {
      setImageUploadError('Please select an image');
      return;
    }

    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '-' + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError('Image upload failed');
        setImageUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, image: downloadURL });
          setImageUploadProgress(null);
          setImageUploadError(null);
        });
      }
    );
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category) {
      setPublishError('Please select a category');
      return;
    }
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message || 'Failed to publish');
        return;
      }
      navigate(`/post/${data.slug}`);
    } catch (err) {
      setPublishError('Something went wrong');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 min-h-screen">
      <h1 className="text-3xl font-semibold text-center my-6">Add Your Shop</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">

        {/* Title */}
        <TextInput
          placeholder="Title"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        {/* Category */}
        <Select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        >
          <option value="" disabled>Select a category</option>
          <option value="Grocery">Grocery</option>
          <option value="Medical">Medical</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
          <option value="Others">Others</option>
        </Select>

        {/* Image Upload */}
        <div className="flex flex-col sm:flex-row gap-4 items-center border-2 border-dotted border-teal-500 p-3 rounded-md">
          <FileInput
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            className='bg-green-400'
            type="button"
            color="green"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress !== null}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </Button>
        </div>

        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img src={formData.image} alt="Uploaded" className="w-full h-72 object-cover rounded-md" />
        )}

        {/* Content */}
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-6"
          value={formData.content}
          onChange={(value) => setFormData({ ...formData, content: value })}
        />

        {/* Submit */}
        <Button type="submit" color="green">Publish</Button>

        {publishError && <Alert color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
