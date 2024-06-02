import { useState, useEffect } from 'react';
import { useParams, Navigate } from "react-router-dom"

export default function ChangeUserPassword({ user }) {
    let [IsLoading, setIsLoading] = useState(true);
    let [validToken, setValidToken] = useState(true);

    const { token } = useParams();

    useEffect(() => {
        async function CheckToken() {
            try {
                const res = await fetch("/checkToken", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ token })
                });
                const data = await res.json();

                if (data.valid) {
                    setIsLoading(false);
                } else {
                    setValidToken(false);
                    setIsLoading(false);
                }
            } catch (e) {
                console.log(e);
            }
        }
        CheckToken();
    }, []);

    async function handleSubmission(e) {

        e.preventDefault();

        let form = document.querySelector("form");
        let password = form.password.value;

        let passwordError = document.querySelector(".passwordErrorr");
        try {
            const res = await fetch("/changeUserPassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include', // Ensure cookies are sent
                body: JSON.stringify({ id: user._id, password })
            });
            const data = await res.json();
            if (data.changed) {
                window.location.assign("/login");
            } else {
                passwordError.textContent = data.error;
                setTimeout(() => {
                    passwordError.textContent = "";
                }, 3000);
            }
        } catch (e) {
            console.log(e);
        }
    }

    return IsLoading === false && validToken ? <div className="checkPassword">
    <form onSubmit={handleSubmission}>
        <input type="password" name="password" placeholder="اكتب كلمة مرورك الجديدة" />
        <p className="passwordErrorr" style={{ margin: "15px", color: "red" }}></p>
        <input type="submit" value="ارسل" />
    </form>
</div> : 
    IsLoading === false && validToken === false ? <Navigate to="/checkPassword" /> : <></>;
}