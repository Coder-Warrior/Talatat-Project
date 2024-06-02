import { useState } from "react";

export default function ChangeImage({ user }) {

    const [imageUrl, setImageUrl] = useState(null);

    async function handleSubmission(e) {
        e.preventDefault();

        let files = document.getElementById("files");
        let imageError = document.querySelector(".imageError");
        let formData = new FormData();

        formData.append("id", user._id);
        formData.append("image", files.files[0]);

        try {
            const res = await fetch("/changeImage", {
                method: "POST",
                body: formData
            });
            const data = await res.json();

            if (data.changed) {
                window.location.assign("/");
            } else {
                imageError.textContent = data.error;
                setTimeout(() => {
                    imageError.textContent = "";
                }, 3000);
            }
        } catch (e) {
            console.log(e);
        }
        
    }

    function previewImage(event) {
        const file = event.target.files[0];
        if (file) {
            if (file.type.startsWith("image/")) {
                const imageUrl = URL.createObjectURL(file);
                setImageUrl(imageUrl);
            }
        }
    }

    return <div className="changeImg">
    <div className="userImage" style={ { margin: "50px" } }>
    {imageUrl ? (
        <img src={imageUrl} alt="User" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: "100px" }} />
    ) : (
        <img src={user.image} alt="Default User" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: "100px" }} />
    )}
   </div>
        <form encType="multipart/form-data" onSubmit={handleSubmission}>
            <input type="file" id="files" onChange={previewImage} accept="image/jpeg,image/png" />
            <p className="imageError" style={{ margin: "15px", color: "red" }}></p>
            <input type="submit" value="غير صورتك" />
        </form>
    </div>
}