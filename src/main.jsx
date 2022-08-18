import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { FlashMessageProvider } from "./contexts/FlashMessageContext";
import { UserProvider } from "./contexts/UserContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <BrowserRouter>
        <UserProvider>
            <FlashMessageProvider>
                <App />
            </FlashMessageProvider>
        </UserProvider>
    </BrowserRouter>
);
