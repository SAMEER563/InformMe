import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div className="bg-gray-50 py-5 min-h-screen">

      {/* Hero Section */}
      <div className="flex flex-col gap-6 p-6 sm:p-10 lg:p-20 max-w-6xl mx-auto bg-white border border-green-200 rounded-xl shadow-sm text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-green-700">
          Find The Best Shops Near You
        </h1>

        <p className="text-green-700/80 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto sm:mx-0">
          Explore top-rated shops, local services, and businesses around you.
          Search, compare, and discover everything you need in your neighborhood.
        </p>

        <Link
          to="/search"
          className="bg-green-600 text-white w-fit px-5 py-2 rounded-lg font-semibold text-sm sm:text-base hover:bg-green-700 transition mx-auto sm:mx-0"
        >
          Browse All Shops
        </Link>
      </div>




      {/* Popular Categories */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-10">
          Popular Categories
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 text-center">
          {[
            { name: "Restaurants", icon: "🍽️" },
            { name: "Grocery Stores", icon: "🛒" },
            { name: "Medical Shops", icon: "💊" },
            { name: "Mobile Shops", icon: "📱" },
            { name: "Salons", icon: "💇‍♀️" },
            { name: "Repair Services", icon: "🔧" },
          ].map((item) => (
            <div
              key={item.name}
              className="bg-white border border-green-200 shadow-sm rounded-lg p-5 hover:shadow-md transition cursor-pointer"
            >
              <div className="text-4xl mb-2">{item.icon}</div>
              <p className="font-semibold text-green-700">{item.name}</p>
            </div>
          ))}
        </div>
      </div>



      {/* Top Rated Shops */}
      <div className="max-w-6xl mx-auto mt-20 px-5">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-10">
          Top Rated Shops
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <div key={post._id} className="bg-white border shadow-sm rounded-lg p-4">
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </div>



      {/* Why Choose Us */}
      <div className="mt-24 bg-white py-16 border-t border-green-200">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-12">
          Why Choose Us?
        </h2>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
          {[
            { title: "Verified Shops", desc: "All listings are verified and trusted.", icon: "✔️" },
            { title: "Nearby Results", desc: "See shops near your current location.", icon: "📍" },
            { title: "Top Reviews", desc: "Ratings help you choose the best option.", icon: "⭐" },
            { title: "Fast Search", desc: "Find what you want instantly.", icon: "⚡" },
          ].map((item) => (
            <div
              key={item.title}
              className="text-center p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <div className="text-5xl">{item.icon}</div>
              <h3 className="mt-4 font-bold text-green-700 text-lg">{item.title}</h3>
              <p className="text-gray-700 text-sm mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>



      {/* Recently Added Shops */}
      <div className="max-w-6xl mx-auto mt-20 px-4">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-8">

            {/* Section Heading */}
            <h2 className="text-3xl font-bold text-center text-green-700">
              Recently Added Shops
            </h2>

            {/* Grid Layout for Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* View More Link */}
            <div className="text-center">
              <Link
                to="/search"
                className="text-lg text-green-700 hover:underline font-medium"
              >
                View More Shops
              </Link>
            </div>

          </div>
        )}
      </div>




      {/* Call To Action */}
      <div className="text-center bg-green-600 py-16 text-white mt-16">
        <h2 className="text-4xl font-bold mb-4">Want to List Your Shop?</h2>
        <p className="text-white/90 text-sm sm:text-base mb-6">
          Join our platform and reach thousands of customers in your area.
        </p>

        <Link
          to="/create-post"
          className="bg-white text-green-700 px-6 py-3 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
        >
          Add Your Shop
        </Link>
      </div>

    </div>
  );
}
