import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Table } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);

  // Pagination states
  const [userPage, setUserPage] = useState(1);
  const [commentPage, setCommentPage] = useState(1);
  const [postPage, setPostPage] = useState(1);
  const itemsPerPage = 5;

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser?.isAdmin) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getcomments`);
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchUsers();
    fetchPosts();
    fetchComments();
  }, [currentUser]);

  // Pagination logic
  const paginate = (items, page) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  };

  const totalUserPages = Math.ceil(users.length / itemsPerPage);
  const totalCommentPages = Math.ceil(comments.length / itemsPerPage);
  const totalPostPages = Math.ceil(posts.length / itemsPerPage);

  return (
    <div className="p-6 md:max-w-7xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
        {/* Users */}
        <div className="flex flex-col bg-green-50 rounded-xl shadow-md p-5">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-gray-600 uppercase text-sm font-medium">Total Users</h3>
              <p className="text-2xl font-bold text-green-700">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-green-600 text-white rounded-full p-3 text-4xl shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm items-center">
            <HiArrowNarrowUp className="text-green-500" />
            <span className="text-green-600 font-medium">{lastMonthUsers} this month</span>
          </div>
        </div>

        {/* Comments */}
        <div className="flex flex-col bg-green-50 rounded-xl shadow-md p-5">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-gray-600 uppercase text-sm font-medium">Total Comments</h3>
              <p className="text-2xl font-bold text-green-700">{totalComments}</p>
            </div>
            <HiAnnotation className="bg-green-600 text-white rounded-full p-3 text-4xl shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm items-center">
            <HiArrowNarrowUp className="text-green-500" />
            <span className="text-green-600 font-medium">{lastMonthComments} this month</span>
          </div>
        </div>

        {/* Posts */}
        <div className="flex flex-col bg-green-50 rounded-xl shadow-md p-5">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-gray-600 uppercase text-sm font-medium">Total Posts</h3>
              <p className="text-2xl font-bold text-green-700">{totalPosts}</p>
            </div>
            <HiDocumentText className="bg-green-600 text-white rounded-full p-3 text-4xl shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm items-center">
            <HiArrowNarrowUp className="text-green-500" />
            <span className="text-green-600 font-medium">{lastMonthPosts} this month</span>
          </div>
        </div>
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-green-700 font-semibold text-lg">Recent Users</h2>
            <Link to="/dashboard?tab=users">
              <button className="text-green-700 border border-green-700 px-3 py-1 rounded">
                See all
              </button>
            </Link>
          </div>
          <Table hoverable={false}>
            <Table.Head>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {paginate(users, userPage).map((user) => (
              <Table.Body key={user._id} className="divide-y">
                <Table.Row className="bg-white">
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {/* Pagination Buttons */}
          {users.length > itemsPerPage && (
            
<div className="flex justify-between mt-3">
  <button
    disabled={userPage === 1}
    onClick={() => setUserPage(userPage - 1)}
    className="px-3 py-1 bg-green-100 text-green-700 rounded disabled:opacity-50"
  >
    Previous
  </button>
  <button
    disabled={userPage === totalUserPages || totalUserPages === 0}
    onClick={() => setUserPage(userPage + 1)}
    className="px-3 py-1 bg-green-100 text-green-700 rounded disabled:opacity-50"
  >
    Next
  </button>
</div>
          )}
          
        </div>

        {/* Recent Comments */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-green-700 font-semibold text-lg">Recent Comments</h2>
            <Link to="/dashboard?tab=comments">
              <button className="text-green-700 border border-green-700 px-3 py-1 rounded">
                See all
              </button>
            </Link>
          </div>
          <Table hoverable={false}>
            <Table.Head>
              <Table.HeadCell>Content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {paginate(comments, commentPage).map((comment) => (
              <Table.Body key={comment._id} className="divide-y">
                <Table.Row className="bg-white">
                  <Table.Cell className="max-w-xs">
                    <p className="line-clamp-2">{comment.content}</p>
                  </Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {comments.length > itemsPerPage && (
            <div className="flex justify-between mt-3">
              <button
                disabled={commentPage === 1}
                onClick={() => setCommentPage(commentPage - 1)}
                className="px-3 py-1 bg-green-100 text-green-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={commentPage === totalCommentPages}
                onClick={() => setCommentPage(commentPage + 1)}
                className="px-3 py-1 bg-green-100 text-green-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Recent Posts */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-green-700 font-semibold text-lg">Recent Posts</h2>
            <Link to="/dashboard?tab=posts">
              <button className="text-green-700 border border-green-700 px-3 py-1 rounded">
                See all
              </button>
            </Link>
          </div>
          <Table hoverable={false}>
            <Table.Head>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {paginate(posts, postPage).map((post) => (
              <Table.Body key={post._id} className="divide-y">
                <Table.Row className="bg-white">
                  <Table.Cell>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-14 h-10 rounded-md object-cover"
                    />
                  </Table.Cell>
                  <Table.Cell className="max-w-xs">{post.title}</Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {posts.length > itemsPerPage && (
            <div className="flex justify-between mt-3">
              <button
                disabled={postPage === 1}
                onClick={() => setPostPage(postPage - 1)}
                className="px-3 py-1 bg-green-100 text-green-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={postPage === totalPostPages}
                onClick={() => setPostPage(postPage + 1)}
                className="px-3 py-1 bg-green-100 text-green-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
