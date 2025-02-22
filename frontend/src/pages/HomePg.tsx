import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Terminal from "../components/HomeComponents/Terminal";
import CodeEditor from "../components/HomeComponents/CodeEditor";
import SideBar from "../components/HomeComponents/SideBar";
import Header from "../components/HomeComponents/Header";
import { setEditorHeight, setEditorWidth } from "../redux/slices/EditorSlice";

const HomePg = () => {
  //global state from redux
  const dispatch = useDispatch();
  const { editorWidth, sideBarOpt } = useSelector(
    (state: RootState) => state.editor
  );

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingSidebar = useRef(false);
  const isDraggingEditor = useRef(false);

  // Handle Sidebar Resize (Horizontal)
  const startSidebarResize = () => {
    isDraggingSidebar.current = true;
    document.addEventListener("mousemove", handleSidebarResize);
    document.addEventListener("mouseup", stopSidebarResize);
    document.addEventListener("touchmove", handleSidebarResize);
    document.addEventListener("touchend", stopSidebarResize);
  };

  const handleSidebarResize = (e: MouseEvent | TouchEvent) => {
    if (!isDraggingSidebar.current || !containerRef.current) return;
    const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
    const containerRect = containerRef.current.getBoundingClientRect();
    dispatch(setEditorWidth(containerRect.right - clientX));
  };

  const stopSidebarResize = () => {
    isDraggingSidebar.current = false;
    document.removeEventListener("mousemove", handleSidebarResize);
    document.removeEventListener("mouseup", stopSidebarResize);
    document.removeEventListener("touchmove", handleSidebarResize);
    document.removeEventListener("touchend", stopSidebarResize);
  };

  // 👉 Handle Editor Resize (Vertical)
  const startEditorResize = () => {
    isDraggingEditor.current = true;
    document.addEventListener("mousemove", handleEditorResize);
    document.addEventListener("mouseup", stopEditorResize);
    document.addEventListener("touchmove", handleEditorResize);
    document.addEventListener("touchend", stopEditorResize);
  };

  const handleEditorResize = (e: MouseEvent | TouchEvent) => {
    if (!isDraggingEditor.current || !containerRef.current) return;
    const clientY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    const containerRect = containerRef.current.getBoundingClientRect();
    dispatch(setEditorHeight(clientY - containerRect.top));
  };

  const stopEditorResize = () => {
    isDraggingEditor.current = false;
    document.removeEventListener("mousemove", handleEditorResize);
    document.removeEventListener("mouseup", stopEditorResize);
    document.removeEventListener("touchmove", handleEditorResize);
    document.removeEventListener("touchend", stopEditorResize);
  };

  //to update the window width on resize
  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
      dispatch(setEditorWidth(window.innerWidth - (sideBarOpt ? 400 : 100)));
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [dispatch, sideBarOpt]);

  return (
    <div className="min-h-screen h-screen flex flex-col">
      <Header />

      <main
        ref={containerRef}
        className="h-[90%] w-[99%] mx-auto flex gap-2 px-3"
      >
        <SideBar />
        <button
          className="my-2 resize-btn cursor-ew-resize w-[5px] after:w-full after:h-[50px]"
          onMouseDown={startSidebarResize}
          onTouchStart={startSidebarResize}
        ></button>

        <section
          className=" flex flex-col gap-2"
          style={{
            width: `clamp(50%,${editorWidth}px,${windowWidth - 110}px)`,
          }}
        >
          <CodeEditor />

          <button
            className="mx-2 resize-btn cursor-ns-resize h-[5px] after:w-[50px] after:h-full"
            onMouseDown={startEditorResize}
            onTouchStart={startEditorResize}
          ></button>

          <Terminal />
        </section>
      </main>
    </div>
  );
};

export default HomePg;