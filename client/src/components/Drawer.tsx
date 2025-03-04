import React from "react";
import ListOfCategories from "./ListOfCategories";

export default function Drawer({children}: {children: React.ReactNode}) {
  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>  
        <ul className="menu bg-base-200 text-base-content min-h-full w-70 p-4">
          {/* Sidebar content here */}
          <div className="divider divider-primary">Categories</div>
          <ListOfCategories />
        </ul>
      </div>
    </div>
  )
}
