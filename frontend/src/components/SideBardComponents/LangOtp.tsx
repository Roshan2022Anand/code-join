import { useDispatch } from "react-redux";
import useRoomServices from "../../sockets/RoomSocket";
import { LangIcons } from "../../utility/Types";
import { setLangOpt } from "../../redux/slices/FileSlice";

const LangOtp = () => {
  const dispatch = useDispatch();
  const { createRoom } = useRoomServices();

  return (
    <section className="flex flex-col px-1 py-2 gap-1">
      {LangIcons.map((lang) => (
        <button
          className="flex button px-2 py-1 gap-2 items-center bg-accent-500 rounded-md"
          key={lang.name}
          onClick={() => {
            createRoom(lang.name == "javascript" ? "node" : lang.name);
            dispatch(setLangOpt({name:lang.name, cmd:lang.runCmd}));
          }}
        >
          <lang.icon className="icon-md-soft" />
          <p>{lang.name}</p>
        </button>
      ))}
    </section>
  );
};

export default LangOtp;
