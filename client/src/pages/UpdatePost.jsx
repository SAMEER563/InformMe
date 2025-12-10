import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null); // 0-100 or null
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    image: '',
    _id: '',
    slug: '',
    userId: '',
  });
  const [publishError, setPublishError] = useState(null);

  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user || {});

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

  useEffect(() => {
    // fetch post details
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message || 'Failed to load post');
          return;
        }
        const post = data.posts && data.posts[0];
        if (!post) {
          setPublishError('Post not found');
          return;
        }
        setPublishError(null);
        setFormData({
          title: post.title || '',
          category: post.category || '',
          content: post.content || '',
          image: post.image || '',
          _id: post._id || '',
          slug: post.slug || '',
          userId: post.userId || '',
        });
      } catch (err) {
        setPublishError('Failed to load post');
        console.error(err);
      }
    };

    fetchPost();
  }, [postId]);

  const handleFileChange = (e) => {
    setImageUploadError(null);
    const f = e.target.files && e.target.files[0];
    if (!f) {
      setFile(null);
      return;
    }
    if (!f.type.startsWith('image/')) {
      setImageUploadError('Please select a valid image file.');
      setFile(null);
      return;
    }
    setFile(f);
  };

  // Upload & submit together using XMLHttpRequest so we can show progress for uploads
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
    if (!currentUser || !currentUser._id) {
      setPublishError('You must be logged in to update the post');
      return;
    }

    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('category', formData.category);
    fd.append('content', formData.content);
    // append image only if a new file selected; backend will keep previous if none provided
    if (file) fd.append('image', file);

    const xhr = new XMLHttpRequest();
    const url = `/api/post/updatepost/${formData._id}/${currentUser._id}`;
    xhr.open('PUT', url, true);
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
          if (res?.slug) {
            navigate(`/post/${res.slug}`);
          } else {
            navigate('/');
          }
        } catch (err) {
          setPublishError('Updated but failed to parse server response');
        }
      } else {
        let msg = 'Failed to update post';
        try {
          const errRes = JSON.parse(xhr.responseText);
          msg = errRes.message || msg;
        } catch (_) {}
        setPublishError(msg);
      }
    };

    xhr.onerror = () => {
      setImageUploadProgress(null);
      setPublishError('Network error while updating.');
    };

    xhr.send(fd);
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Shop</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            value={formData.title}
          />
        </div>

        <div className="flex flex-col gap-4 justify-between sm:flex-row">
          <Select
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="Grocery">Grocery</option>
            <option value="Medical">Medical</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Others">Others</option>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput type="file" accept="image/*" onChange={handleFileChange} />

          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={() => {
              // clear selected new file
              setFile(null);
              setImageUploadError(null);
            }}
            disabled={imageUploadProgress !== null}
          >
            Clear
          </Button>

          <div>
            {imageUploadProgress !== null ? (
              <div className="w-16 h-16">
                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
              </div>
            ) : (
              <div className="text-sm text-gray-600">{file ? file.name : 'No new file selected'}</div>
            )}
          </div>
        </div>

        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}

        {/* Preview: new selected file preview takes precedence */}
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="w-full h-72 object-cover rounded-md" />
        ) : formData.image ? (
          <img src={formData.image} alt="Uploaded" className="w-full h-72 object-cover rounded-md" />
        ) : null}

        <ReactQuill
          theme="snow"
          value={formData.content}
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />

        <Button type="submit" color="green" disabled={imageUploadProgress !== null}>
          {imageUploadProgress !== null ? 'Updating...' : 'Update Shop'}
        </Button>

        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
