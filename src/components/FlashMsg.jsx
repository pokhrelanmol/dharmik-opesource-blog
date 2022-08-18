import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useFlash } from "../contexts/FlashMessageContext";

export default function FlashMsg() {
    const { flashMessage, setFlashMessage } = useFlash();
    // const bgColor = flashMessage.type? "bg-brightGreen" : "bg-brightRed";
    const bgColor =
        flashMessage.type === "success"
            ? "bg-brightGreen"
            : flashMessage.type === "error"
            ? "bg-brightRed"
            : flashMessage.type === "warning"
            ? "bg-brightYellow"
            : "bg-brightBlue";

    useEffect(() => {
        setTimeout(() => {
            setFlashMessage({ msg: "", show: false });
        }, 3000);
    }, [flashMessage.show]);
    if (flashMessage.show) {
        return (
            <div
                className={`z-10 min-w-max flex items-center gap-10 justify-between text-primary fixed py-3 px-5 rounded-lg shadow-lg left-1/2 -translate-x-1/2 bottom-12 ${bgColor}`}
            >
                {flashMessage.msg}
                <FontAwesomeIcon
                    icon={faTimes}
                    className="cursor-pointer"
                    onClick={() => setFlashMessage({ show: false, msg: "" })}
                />
            </div>
        );
    } else {
        return <div></div>;
    }
}
