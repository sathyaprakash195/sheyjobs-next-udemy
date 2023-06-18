"use client";
import React, { useEffect, useState } from "react";
import { ConfigProvider, message } from "antd";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SetCurrentUser } from "@/redux/usersSlice";
import Loader from "./Loader";
import { SetLoading } from "@/redux/loadersSlice";

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useSelector((state: any) => state.users);
  const { loading } = useSelector((state: any) => state.loaders);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(true);
  const [menuItems, setMenuItems] = useState([
    {
      name: "Home",
      path: "/",
      icon: "ri-home-7-line",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: "ri-shield-user-line",
    },
    {
      name: "Applications",
      path: "/applications",
      icon: "ri-file-list-2-line",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "ri-settings-2-line",
    },
    {
      name: "Saved",
      path: "/saved",
      icon: "ri-save-line",
    },
  ]);

  const pathname = usePathname();

  const getCurrentUser = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await axios.get("/api/users/currentuser");
      const isEmployer = response.data.data.userType === "employer";

      if (isEmployer) {
        const tempMenuItems: any = menuItems;
        tempMenuItems[2].name = "Posted Jobs";
        tempMenuItems[2].path = "/jobs";
        setMenuItems(tempMenuItems);
      }

      dispatch(SetCurrentUser(response.data.data));
    } catch (error: any) {
      message.error(error.response.data.message || "Something went wrong");
      message.error("Please clear your cookies and try again");
    } finally {
      dispatch(SetLoading(false));
    }
  };

  useEffect(() => {
    if (pathname !== "/login" && pathname !== "/register" && !currentUser) {
      getCurrentUser();
    }
  }, [pathname]);

  const onLogout = async () => {
    try {
      dispatch(SetLoading(true));
      await axios.post("/api/users/logout");
      message.success("Logged out successfully");
      dispatch(SetCurrentUser(null));
      router.push("/login");
    } catch (error: any) {
      message.error(error.response.data.message || "Something went wrong");
    } finally {
      dispatch(SetLoading(false));
    }
  };

  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@3.2.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#213555",
            },
          }}
        >
          {loading && <Loader />}

          {/* if route is login or register , dont show layout */}

          {pathname === "/login" || pathname === "/register" ? (
            <div>{children}</div>
          ) : (
            currentUser && (
              <div className="layout-parent">
                <div className="sidebar">
                  <div className="logo">
                    {isSidebarExpanded && <h1>SHEYJOBS</h1>}

                    {!isSidebarExpanded && (
                      <i
                        className="ri-menu-2-line"
                        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                      ></i>
                    )}
                    {isSidebarExpanded && (
                      <i
                        className="ri-close-line"
                        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                      ></i>
                    )}
                  </div>

                  <div className="menu-items">
                    {menuItems.map((item, index) => {
                      const isActive = pathname === item.path;
                      return (
                        <div
                          className={`menu-item ${
                            isActive ? "active-menu-item" : ""
                          }`}
                          style={{
                            justifyContent: isSidebarExpanded
                              ? "flex-start"
                              : "center",
                          }}
                          key={index}
                          onClick={() => router.push(item.path)}
                        >
                          <i className={item.icon}></i>
                          <span>{isSidebarExpanded && item.name}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="user-info">
                    {isSidebarExpanded && (
                      <div className="flex flex-col">
                        <span>{currentUser?.name}</span>
                        <span>{currentUser?.email}</span>
                      </div>
                    )}

                    <i className="ri-logout-box-r-line" onClick={onLogout}></i>
                  </div>
                </div>
                <div className="body">{children}</div>
              </div>
            )
          )}
        </ConfigProvider>
      </body>
    </html>
  );
}

export default LayoutProvider;
