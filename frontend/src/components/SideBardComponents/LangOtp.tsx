import { useDispatch } from "react-redux";
import useRoomServices from "../../sockets/Room";
import { LangIcons } from "../../utility/Types";
import { setLangOpt } from "../../redux/slices/File";

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
            createRoom(lang.name);
            dispatch(setLangOpt(lang.name));
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
