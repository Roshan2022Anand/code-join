import { IoSend } from "react-icons/io5";

const ChatBox = () => {
  return (
    <figure className="flex-1 flex flex-col p-1">
      <section className="flex-1"></section>
      <section className="flex justify-between  bg-accent-800 rounded-md p-1">
        <input type="text" className="w-[70%] outline-none text-black font-bold" />
        <button className="bg-accent-200 px-2 py-1 rounded-md button">
          <IoSend className="icon-md-soft mx-auto" />
        </button>
      </section>
    </figure>
  );
};

export default ChatBox;