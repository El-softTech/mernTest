import { Outlet } from "react-router-dom";
import { DefaultSidebar } from "../../Components/Navbar";

const Layout = () => {
  return (
    <>
      <DefaultSidebar />
      <main className=" w-full py-20 md:px-20 rounded-md  h-screen  ">
        <div className="">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default Layout;
