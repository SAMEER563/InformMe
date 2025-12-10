import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null); // number 0-100 or null
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    image: '' // server URL after submit
  });
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // create preview when file changes
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (e) => {
    setImageUploadError(null);
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setFile(null);
      return;
    }
    // basic file type check
    if (!f.type.startsWith('image/')) {
      setImageUploadError('Please select a valid image file.');
      setFile(null);
      return;
    }
    setFile(f);
  };

  // Submit form with file using XMLHttpRequest so we can show upload progress
  const handleSubmit = (e) => {
    e.preventDefault();
    setPublishError(null);
    setImageUploadError(null);

    if (!formData.title?.trim()) {
      setPublishError('Please enter a title');
      return;
    }
    if (!formData.category) {
      setPublishError('Please select a category');
      return;
    }
    if (!formData.content?.trim()) {
      setPublishError('Please add content');
      return;
    }

    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('category', formData.category);
    fd.append('content', formData.content);
    // append file if available (field name "image" matches backend)
    if (file) fd.append('image', file);

    // Use XMLHttpRequest to track upload progress
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/post/create', true);
    // send cookies (so verifyToken via cookie works)
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setImageUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      setImageUploadProgress(null);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          // if server returned the created post with slug
          if (res?.slug) {
            navigate(`/post/${res.slug}`);
          } else {
            // fallback: go to posts list
            navigate('/');
          }
        } catch (err) {
          setPublishError('Published but response parsing failed.');
        }
      } else {
        let msg = 'Failed to publish';
        try {
          const errRes = JSON.parse(xhr.responseText);
          msg = errRes.message || msg;
        } catch (_) {}
        setPublishError(msg);
      }
    };

    xhr.onerror = () => {
      setImageUploadProgress(null);
      setPublishError('Network error while publishing.');
    };

    xhr.send(fd);
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
            onChange={handleFileChange}
          />

          <div className="flex items-center gap-3">
            <Button
              type="button"
              color="gray"
              onClick={() => {
                // clear selected file
                setFile(null);
                setImageUploadError(null);
              }}
            >
              Clear
            </Button>

            {/* Show progress or text about the file */}
            {imageUploadProgress !== null ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress}%`}
                />
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                {file ? file.name : 'No file selected'}
              </div>
            )}
          </div>
        </div>

        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}

        {/* preview (either client file preview or already uploaded image url) */}
        {previewUrl && (
          <img src={previewUrl} alt="Preview" className="w-full h-72 object-cover rounded-md" />
        )}
        {!previewUrl && formData.image && (
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
        <Button type="submit" color="green" disabled={imageUploadProgress !== null}>
          {imageUploadProgress !== null ? 'Publishing...' : 'Publish'}
        </Button>

        {publishError && <Alert color="failure">{publishError}</Alert>}
      </form>
    </div>
  );
}
