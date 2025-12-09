import { Alert, Button, Modal, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import Comment from './Comment';

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const navigate = useNavigate();

  // Submit new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment || comment.length > 200) return;
    try {
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: comment, postId, userId: currentUser._id }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments([data, ...comments]);
        setComment('');
        setCommentError(null);
      }
    } catch (err) {
      setCommentError(err.message);
    }
  };

  // Fetch comments
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    if (!currentUser) return navigate('/sign-in');
    try {
      const res = await fetch(`/api/comment/likeComment/${commentId}`, { method: 'PUT' });
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((c) =>
            c._id === commentId ? { ...c, likes: data.likes, numberOfLikes: data.likes.length } : c
          )
        );
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleEdit = (comment, editedContent) => {
    setComments(comments.map((c) => (c._id === comment._id ? { ...c, content: editedContent } : c)));
  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) return navigate('/sign-in');
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, { method: 'DELETE' });
      if (res.ok) setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="max-w-4xl w-full p-3">
      {/* Signed in info */}
      {currentUser ? (
        <div className="flex items-center gap-2 my-5 text-gray-600 text-sm">
          <img className="h-6 w-6 object-cover rounded-full" src={currentUser.profilePicture} alt="" />
          <p>
            Signed in as{' '}
            <Link to="/dashboard?tab=profile" className="text-cyan-600 hover:underline">
              @{currentUser.username}
            </Link>
          </p>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5">
          You must{' '}
          <Link className="text-blue-500 hover:underline" to="/sign-in">
            Sign In
          </Link>{' '}
          to comment.
        </div>
      )}

      {/* Comment form */}
      {currentUser && (
        <form onSubmit={handleSubmit} className="border border-teal-500 rounded-md p-3 mb-6">
          <Textarea
            placeholder="Add a comment..."
            rows={3}
            maxLength={200}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-between items-center mt-3">
            <p className="text-gray-500 text-xs">{200 - comment.length} characters remaining</p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {commentError && <Alert color="failure" className="mt-3">{commentError}</Alert>}
        </form>
      )}

      {/* Comments list */}
      {comments.length === 0 ? (
        <p className="text-sm text-gray-500">No comments yet!</p>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold">Comments ({comments.length})</p>
          {comments.map((c) => (
            <Comment
              key={c._id}
              comment={c}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(id) => {
                setShowModal(true);
                setCommentToDelete(id);
              }}
            />
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-left">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4" />
            <h3 className="text-lg text-gray-600 mb-5">Are you sure you want to delete this comment?</h3>
            <div className="flex gap-3">
              <Button color="failure" onClick={() => handleDelete(commentToDelete)}>Yes, Delete</Button>
              <Button color="gray" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
