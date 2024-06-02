import React, { useState } from 'react';
import defaultImg from '../imgs/download.png';

export default function Register() {
    const [imageUrl, setImageUrl] = useState(null);

    async function handleSubmission(event) {
        event.preventDefault();

        let form = document.getElementsByTagName("form")[0];
        let username = form.username.value;
        let email = form.email.value;
        let password = form.password.value;
        let files = document.getElementById("files");
        let picture = files.files[0];

        let usernameError = document.querySelector('.usernameError');
        let emailError = document.querySelector('.emailError');
        let passwordError = document.querySelector(".passwordError");
        let imageError = document.querySelector(".imageError");

        let formData = new FormData();

        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("picture", picture);

        const res = await fetch("/auth/register", {
            method: "POST",
            credentials: 'include', // Ensure cookies are sent
            body: formData
        });
        const data = await res.json();
        if (data.user) {
            window.location.assign(`/emailVerification/${data.user._id}`);
        } else {
            usernameError.textContent = data.errors.username;
            emailError.textContent = data.errors.email;
            passwordError.textContent = data.errors.password;
            imageError.textContent = data.errors.image;
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

    return (
        <div className="register">
            <h2>انشاء حساب</h2>
            
            <div className="userImage" style={ { margin: "50px" } }>
                {imageUrl ? (
                    <img src={imageUrl} alt="User" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: "100px" }} />
                ) : (
                    <img src={defaultImg} alt="Default User" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: "100px" }} />
                )}
            </div>

            <form method="POST" onSubmit={handleSubmission} encType="multipart/form-data">
                <input type="text" name="username" placeholder="اكتب اسم المستخدم" />
                <p className="usernameError"></p>
                <input type="text" name="email" placeholder="اكتب بريدك الاكتروني" />
                <p className="emailError"></p>
                <input type="password" name="password" placeholder="اكتب كلمة المرور"/>
                <p className="passwordError"></p>
                <input type="file" name="file" id="files" onChange={previewImage} plcaholder="اختر صورة" accept='image/jpeg,image/jpg,image/png' />
                <p className="imageError"></p>
                <input type="submit" value="انشاء حساب" />
            </form>
        </div>
    );
}