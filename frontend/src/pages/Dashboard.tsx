import { FaToolbox } from "react-icons/fa";
import { langIcons } from "../utility/languages";
import { createElement, useEffect } from "react";
import {
  setCurrentLang,
  useCreateContainerMutation,
} from "../redux/slices/TerminalSlice";
import { RiLoaderFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Dashboard = () => {
  //global state from redux
  const dispatch = useDispatch();
  const { email } = useSelector((state: RootState) => state.room);

  const navigate = useNavigate();

  //to check if user is authenticated
  useEffect(() => {
    if (!email) navigate("/");
  }, [email, navigate]);

  //to create a container
  const [create, { isLoading, isSuccess }] = useCreateContainerMutation();

  useEffect(() => {
    if (isSuccess) navigate("/home");
  }, [isSuccess, navigate]);

  const handleSetup = async (lang: string) => {
    dispatch(setCurrentLang(lang == "NodeJS" ? "javascript" : lang));
    await create({ lang });
  };

  return (
    <div className="h-screen content-center">
      <main className="bg-secondary w-2/3 h-[35vh] md:size-[800px] rounded-lg overflow-hidden flex flex-col mx-auto relative">
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
          <button className=" size-fit p-2 bg-accent-500 rounded-lg">
            <h3>Join Room</h3>
          </button>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
