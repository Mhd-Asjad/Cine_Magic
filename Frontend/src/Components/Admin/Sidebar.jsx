import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sidebarItems, subMenus } from "./sidebarconstants";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

function Sidebar() {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-full fixed top-0 left-0 shadow-lg">
      <div className="py-6 px-4 text-xl font-semibold border-b border-gray-700">
        <Link to="/admin/dashboard">Admin Dashboard</Link>
      </div>

      <div className="overflow-y-auto pr-4" style={{ marginRight: "-13px", height: "90%" }}>
        <ul className="space-y-5">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const hasSubMenu = subMenus[item.id];

            return (
              <li key={item.id} className="relative">
                {hasSubMenu ? (
                  <>
                    <div
                      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-700 hover:scale-105`}
                      onClick={() => toggleDropdown(item.id)}
                    > 
                      <span className="bg-white/20 p-2 rounded-lg text-center transition-all hover:bg-white/30">
                        <Icon size={22} />
                      </span>
                      <div className="flex justify-between w-full">
                        <span className="text-md font-medium">{item.title}</span>
                        <span>
                          {activeDropdown === item.id ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                        </span>
                      </div>
                    </div>

                    
                    <ul
                      className={`ml-6 mt-2 space-y-2 overflow-hidden duration-300 ${
                        activeDropdown === item.id ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      {subMenus[item.id].map((subItem, idx) => (
                        <li key={idx}>
                          <Link
                            to={`/admin/${subItem.toLowerCase().replace(" ", "_")}`}
                            className="p-2 block bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 hover:text-white"
                          >
                            {subItem}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link
                    to={`/admin/${item.url === "dashboard" ? "" : item.url}`}
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-700 hover:scale-105`}
                  >
                    <span className="bg-white/20 p-2 rounded-lg text-center transition-all hover:bg-white/30">
                      <Icon size={22} />
                    </span>
                    <span className="text-md font-medium">{item.title}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
