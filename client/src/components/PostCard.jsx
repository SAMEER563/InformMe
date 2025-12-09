import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className="bg-white border border-green-300 hover:border-green-600 shadow-sm hover:shadow-md rounded-lg overflow-hidden transition-all">

      {/* Image */}
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt={post.title}
          className="h-[220px] w-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">

        {/* Shop Title */}
        <h3 className="text-lg font-semibold text-green-800 line-clamp-2">
          {post.title}
        </h3>

        {/* Category */}
        <p className="text-sm text-green-600 italic">
          {post.category}
        </p>

        {/* Button */}
        <Link
          to={`/post/${post.slug}`}
          className="mt-3 text-center border border-green-600 text-green-700 font-medium py-2 rounded-md hover:bg-green-600 hover:text-white transition"
        >
          View Shop
        </Link>
      </div>
    </div>
  );
}
