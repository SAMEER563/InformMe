import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill in all fields"));
    }
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) dispatch(signInFailure(data.message));

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left section */}
        <div className="flex-1 bg-green-600 text-white p-10 flex flex-col justify-center">
          <Link to="/" className="text-4xl font-bold mb-5 inline-block">
            <span className="bg-white text-green-600 px-3 py-1 rounded-lg">Store</span> Beacon
          </Link>
          <p className="mt-4 text-green-100">
            A platform where shops can list their businesses and users can easily find shop details.
            Built with modern web technologies for a smooth experience.
          </p>
        </div>

        {/* Right section */}
        <div className="flex-1 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-green-700 mb-6">Sign In to Your Account</h2>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label htmlFor="email" className="mb-1 text-gray-700 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="name@company.com"
                onChange={handleChange}
                className="border border-green-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-1 text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="*********"
                onChange={handleChange}
                className="border border-green-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`bg-green-600 text-white font-semibold py-2 rounded-md transition hover:bg-green-700 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            <OAuth />
          </form>

          <div className="mt-5 text-sm text-gray-600 flex justify-between">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-green-600 font-medium hover:underline">
              Sign Up
            </Link>
          </div>

          {errorMessage && (
            <div className="mt-5 p-3 bg-red-100 text-red-700 rounded-md">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
