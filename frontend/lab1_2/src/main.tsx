import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider, theme } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ru";
import "./index.css";
import App from "./App";
import { store } from "./app/store";

dayjs.locale("ru");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
            token: {
              colorPrimary: "#fa8c16",
              colorLink: "#fa8c16",
              borderRadius: 14,
              fontSize: 14,
            },
          }}
        >
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);