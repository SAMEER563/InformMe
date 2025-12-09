import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) throw new Error('Failed to fetch post');
        setPost(data.posts[0]);
        setLoading(false);
      } catch {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  // Fetch recent posts
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) setRecentPosts(data.posts);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchRecentPosts();
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen"><Spinner size="xl" /></div>;
  if (error || !post) return <div className="text-center text-red-600 mt-20"><h2 className="text-2xl font-bold">Oops! Post not found.</h2></div>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 flex flex-col gap-12">
      {/* Post Layout: Left Image / Right Content */}
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="lg:w-3/5 w-full flex justify-center">
          <img src={post.image} alt={post.title} className="w-full h-auto object-cover rounded-lg aspect-video shadow-lg" />
        </div>
        <div className="lg:w-2/5 w-full flex flex-col gap-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-green-700">{post.title}</h1>
          <Link to={`/search?category=${post.category}`}>
            <Button color="green" size="sm" pill>{post.category}</Button>
          </Link>
          <article className="prose max-w-full text-gray-800">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
          <div className="flex gap-6 text-sm text-gray-500 mt-4">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="italic">{(post.content.length / 1000).toFixed(0)} min read</span>
          </div>
        </div>
      </div>

      {/* Comments */}
      <CommentSection postId={post._id} />

      {/* Recent Articles */}
      {recentPosts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-700 text-center mb-8">Recent Shops</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((p) => <PostCard key={p._id} post={p} />)}
          </div>
        </section>
      )}
    </main>
  );
}
