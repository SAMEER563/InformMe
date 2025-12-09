import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
  const [filters, setFilters] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'Uncategorized',
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch posts whenever URL changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');

    setFilters((prev) => ({
      ...prev,
      searchTerm: searchTermFromUrl || '',
      sort: sortFromUrl || 'desc',
      category: categoryFromUrl || 'Uncategorized',
    }));

    const fetchPosts = async () => {
      setLoading(true);
      const res = await fetch(`/api/post/getposts?${urlParams.toString()}`);
      if (!res.ok) return setLoading(false);
      const data = await res.json();
      setPosts(data.posts);
      setLoading(false);
      setShowMore(data.posts.length === 9);
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFilters({ ...filters, [id]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(filters).toString();
    navigate(`/search?${params}`);
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const res = await fetch(`/api/post/getposts?${urlParams.toString()}`);
    if (!res.ok) return;
    const data = await res.json();
    setPosts([...posts, ...data.posts]);
    setShowMore(data.posts.length === 9);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-green-50">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-1/4 bg-green-100 p-6 border-b md:border-b-0 md:border-r border-green-300">
        <h2 className="text-xl font-bold text-green-700 mb-6">Filter Shops</h2>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="searchTerm" className="block font-medium text-green-800 mb-1">
              Search
            </label>
            <TextInput
              id="searchTerm"
              type="text"
              value={filters.searchTerm}
              placeholder="Type keywords..."
              onChange={handleChange}
              className="border-green-400 focus:border-green-600"
            />
          </div>

          <div>
            <label htmlFor="sort" className="block font-medium text-green-800 mb-1">
              Sort By
            </label>
            <Select id="sort" value={filters.sort} onChange={handleChange}>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>

          <div>
            <label htmlFor="category" className="block font-medium text-green-800 mb-1">
              Category
            </label>
            <Select id="category" value={filters.category} onChange={handleChange}>
              <option value="Uncategorized">All Categories</option>
              <option value="Placement">Placement</option>
              <option value="Exams">Exams</option>
              <option value="Holiday">Holiday</option>
              <option value="Events">Events</option>
            </Select>
          </div>

          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
            Apply Filters
          </Button>
        </form>
      </aside>

      {/* Posts Section */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-green-700 mb-6 border-b border-green-300 pb-2">
          Shop Results
        </h1>

        {loading && <p className="text-green-800 text-lg">Loading...</p>}
        {!loading && posts.length === 0 && (
          <p className="text-green-800 text-lg">No shops found matching your criteria.</p>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {showMore && (
          <div className="mt-6 text-center">
            <Button
              onClick={handleShowMore}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
            >
              Show More
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
