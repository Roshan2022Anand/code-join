import { useMyContext } from "../utility/MyContext";

const useChatService = () => {
  const { socket } = useMyContext();
};

export default useChatService;