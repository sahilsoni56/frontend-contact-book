import Navbar from "./Navbar";

const Layout = ({ navbar = true, children }) => {
  return (
    <>
      {navbar && <Navbar />}
      <div className="container mx-auto mt-3 p-4">{children}</div>
    </>
  );
};

export default Layout;
