import React from "react";
const FlashMessageContext = React.createContext();

export const FlashMessageProvider = ({ children }) => {
    const [flashMessage, setFlashMessage] = React.useState({
        show: false,
        msg: "",
        type: "",
    });
    return (
        <FlashMessageContext.Provider value={{ flashMessage, setFlashMessage }}>
            {children}
        </FlashMessageContext.Provider>
    );
};

export const useFlash = () => React.useContext(FlashMessageContext);
