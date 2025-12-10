import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const path = useLocation().pathname;
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <Navbar className="bg-white border-b border-green-200 shadow-md">
      {/* Logo */}
      <Link
        to="/"
        className="self-center text-xl sm:text-2xl font-semibold text-green-700"
      >
        <span className="px-3 py-1 bg-green-600 text-white rounded-md">
          Store
        </span>{' '}
        Beacon
      </Link>

      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="flex-1 mx-6 hidden lg:flex">
        <TextInput
          type="text"
          placeholder="Search shops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          rightIcon={AiOutlineSearch}
          className="rounded-lg border-green-400 focus:border-green-600"
        />
      </form>

      {/* Mobile Search Button */}
      {/* <Button className="w-12 h-10 lg:hidden" color="green" pill>
        <AiOutlineSearch />
      </Button> */}

      {/* Right Section */}
      <div className="flex gap-3 sm:pl-0 md:pl-4 md:order-2">
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="user"
                img={currentUser.profilePicture}
                rounded
                className="ring-2 ring-green-600"
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to="/dashboard?tab=profile">
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign Out</Dropdown.Item>
          </Dropdown>
        ) : (
         <Link to="/sign-in">
  <Button
    className="px-2 py-1 rounded-lg font-semibold text-white bg-green-600 "
  >
    Sign In
  </Button>
</Link>

        )}
        <Navbar.Toggle />
      </div>

      {/* Menu Links */}
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'}>
          <Link to="/" className="hover:text-green-700 transition">
            Home
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={'div'}>
          <Link to="/about" className="hover:text-green-700 transition">
            About
          </Link>
        </Navbar.Link>
        <Navbar.Link active={path === '/contactus'} as={'div'}>
          <Link to="/contactus" className="hover:text-green-700 transition">
            Contact Us
          </Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
