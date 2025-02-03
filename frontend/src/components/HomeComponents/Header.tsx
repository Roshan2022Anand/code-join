import { FaCircleUser } from "react-icons/fa6";

const Header = () => {
  return (
    <header className="px-3 flex justify-between">
      <h1 className="text-accent-300">JOIN CODE.</h1>
      <div>
        <FaCircleUser className="icon-lg" />
      </div>
    </header>
  );
};

export default Header;
