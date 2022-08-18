import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import {
    faAdd,
    faImage,
    faSpinner,
    faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addDoc, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { postsColRef, storage } from "../firebase/firebase";
import { compressImage } from "../utils/compress-image";
export default function NewPost() {
    const [titleText, setTitleText] = useState("");
    const [imgFile, setImgFile] = useState(null);
    const [previewImgUrl, setPreviewImgUrl] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const { user } = useUser();
    function post(e) {
        e?.preventDefault();
        setIsPosting(true);

        if (!imgFile) return;

        const image = imgFile;

        // console.log(`img size after ${image.size / 1024 / 1024} MB`);
        const imgRef = ref(storage, `images/${v4()}`);

        uploadBytes(imgRef, image).then(async () => {
            const url = await getDownloadURL(imgRef);
            addDoc(postsColRef, {
                title: titleText,
                img: url,
                createdAt: serverTimestamp(),
                likedBy: [],
                uid: user.uid,
            }).then(() => {
                setTitleText("");
                setImgFile(null);
                setPreviewImgUrl("");
                setIsPosting(false);
            });
        });
    }

    async function showImgPreview(e) {
        if (!e.target.files[0]) return;

        const img = e.target.files[0];
        // console.log(`img size before ${img.size / 1024 / 1024} MB`);
        const compressedImageFile = await compressImage(img);

        setImgFile(compressedImageFile);
        const url = URL.createObjectURL(compressedImageFile);
        setPreviewImgUrl(url);
    }

    return (
        <div
            className={`grid bg-primary border border-[#ccc] p-3 rounded-lg shadow-lg 
    dark:bg-darkText dark:border-primary dark:text-primary ${
        user.email && "mt-5"
    }`}
        >
            <form onSubmit={(e) => post(e)}>
                <div className="flex items-center border-2 border-secondary rounded-lg dark:border-[#ccc] dark:bg-darkText dark:text-darkText">
                    <input
                        type="text"
                        placeholder="New Post"
                        value={titleText}
                        className="w-full bg-primary h-full p-2 lg:p-4 border-r-2 border-secondary focus:outline-none
							dark:bg-darkText dark:border-[#ccc] dark:text-primary rounded-l-lg"
                        onChange={(e) => setTitleText(e.target.value)}
                    />
                    <label
                        htmlFor="imageUploadBtn"
                        className="p-3 lg:p-3.5 cursor-pointer"
                    >
                        {/* show image svg */}
                        <FontAwesomeIcon
                            icon={faImage}
                            size="lg"
                            className="text-lg lg:text-xl dark:text-primary"
                        />
                    </label>
                    <input
                        type="file"
                        id="imageUploadBtn"
                        className="hidden"
                        onChange={(e) => showImgPreview(e)}
                    />
                </div>
                {previewImgUrl && (
                    <div className="grid">
                        <div className="relative my-3">
                            <img src={previewImgUrl} className="w-full" />
                            <FontAwesomeIcon
                                icon={faTimesCircle}
                                size="2xl"
                                className="absolute top-3 right-3 cursor-pointer bg-primary aspect-square rounded-full text-[#181a1d]"
                                onClick={() => setPreviewImgUrl("")}
                            />
                        </div>
                        <button
                            className="border-2 border-secondary py-2 px-6 rounded-full justify-self-end transition-colors hover:bg-secondary"
                            onClick={post}
                            disabled={isPosting}
                        >
                            {isPosting ? (
                                <FontAwesomeIcon icon={faSpinner} spin />
                            ) : (
                                "Post"
                            )}
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}
