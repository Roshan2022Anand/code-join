import React from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";

//wrapper for redux provider
const ReduxProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
