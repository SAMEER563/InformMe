import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) setTab(tabFromUrl);
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", { method: "POST" });
      const data = await res.json();

      if (!res.ok) console.log(data.message);
      else dispatch(signoutSuccess());
    } catch (error) {
      console.log(error.message);
    }
  };

  const activeStyle = "bg-green-100 text-green-700";
  const hoverStyle = "hover:bg-green-50 transition-all duration-200";

  return (
    <Sidebar className="w-full md:w-60 shadow-md rounded-lg bg-white">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1 p-2">

          {currentUser && currentUser.isAdmin && (
            <Link to="/dashboard?tab=dash">
              <Sidebar.Item
                as="div"
                icon={HiChartPie}
                active={tab === "dash" || !tab}
                className={`rounded-md ${hoverStyle} ${
                  tab === "dash" || !tab ? activeStyle : ""
                }`}
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}

          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              as="div"
              icon={HiUser}
              active={tab === "profile"}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="success"
              className={`rounded-md ${hoverStyle} ${
                tab === "profile" ? activeStyle : ""
              }`}
            >
              Profile
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                as="div"
                icon={HiDocumentText}
                active={tab === "posts"}
                className={`rounded-md ${hoverStyle} ${
                  tab === "posts" ? activeStyle : ""
                }`}
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.isAdmin && (
            <>
              <Link to="/dashboard?tab=users">
                <Sidebar.Item
                  as="div"
                  icon={HiOutlineUserGroup}
                  active={tab === "users"}
                  className={`rounded-md ${hoverStyle} ${
                    tab === "users" ? activeStyle : ""
                  }`}
                >
                  Users
                </Sidebar.Item>
              </Link>

              <Link to="/dashboard?tab=comments">
                <Sidebar.Item
                  as="div"
                  icon={HiAnnotation}
                  active={tab === "comments"}
                  className={`rounded-md ${hoverStyle} ${
                    tab === "comments" ? activeStyle : ""
                  }`}
                >
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          )}

          <Sidebar.Item
            icon={HiArrowSmRight}
            className={`cursor-pointer text-red-600 hover:bg-red-50 rounded-md transition-all duration-200`}
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
