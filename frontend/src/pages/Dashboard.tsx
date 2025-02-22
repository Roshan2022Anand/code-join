import { FaToolbox } from "react-icons/fa";
import { langIcons } from "../utility/languages";
import { createElement, useEffect, useRef } from "react";
import {
  setCurrentLang,
  useCreateContainerMutation,
} from "../redux/slices/TerminalSlice";
import { RiLoaderFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ConnectSocket } from "../sockets/ConnectSocket";
import RoomServices from "../sockets/RoomSocket";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { createRoom, joinRoom } = RoomServices(); //hook to listen to room events
  ConnectSocket(); //hook to connect to socket
  const navigate = useNavigate();

  //global state from redux
  const dispatch = useDispatch();
  const { email, profile, userName } = useSelector(
    (state: RootState) => state.room
  );

  //to check if user is authenticated
  useEffect(() => {
    if (!email) navigate("/");
  }, [email, navigate]);

  //to create a container
  const [create, { isLoading, isSuccess }] = useCreateContainerMutation();
  useEffect(() => {
    if (isSuccess) createRoom();
  }, [isSuccess, createRoom]);
  const handleSetup = async (lang: string) => {
    dispatch(setCurrentLang(lang == "NodeJS" ? "javascript" : lang));
    await create({ lang });
  };

  //to join a room
  const idInput = useRef<HTMLInputElement>(null);
  const handleJoinRoom = () => {
    const value = idInput.current?.value;
    if (!value || value == "") {
      toast.error("Please enter a room ID");
      return;
    }
    joinRoom(value);
  };

  return (
    <main className="h-screen flex flex-col items-center">
      <nav className="w-full flex flex-row-reverse items-center gap-5 p-2">
        <img
          src={`${profile}`}
          alt={`${userName}`}
          className="size-[100px] rounded-full border-4 border-accent-300"
        />
        <h3>{userName}</h3>
      </nav>
      <article className="bg-secondary w-2/3 h-[35vh] md:size-[800px] rounded-lg overflow-hidden flex flex-col mrelative">
        {isLoading && (
          <div className="dashboard-loader">
            <RiLoaderFill className="size-[100px] text-accent-500 animate-spin mx-auto" />
          </div>
        )}
        <header className="p-3 bg-soft flex gap-5">
          <FaToolbox className="icon-md" />
          <h3>Choose a language to work</h3>
        </header>
        <section className="flex-1 h-[70%] overflow-x-auto flex flex-wrap gap-2 p-2">
          {langIcons.map(({ name, icon }) => {
            return (
              <button
                key={name}
                className="prg-opt-btn rounded-lg bg-accent-700 p-2 size-fit"
                onClick={() => handleSetup(name)}
              >
                {createElement(icon, { className: "icon-md" })}
                <h3 className="text-accent-200">/{name}</h3>
              </button>
            );
          })}
        </section>

        <section className="flex items-center justify-end p-3 gap-3 ">
          <h3>OR</h3>
          <input type="text" ref={idInput} />
          <button
            className=" size-fit p-2 bg-accent-500 rounded-lg"
            onClick={handleJoinRoom}
          >
            <h3>Join Room</h3>
          </button>
        </section>
      </article>
    </main>
  );
};

export default Dashboard;
