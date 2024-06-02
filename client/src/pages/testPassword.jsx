import { Link } from 'react-router-dom';
export default function CheckPassword({ user }) {
    
    async function handleSubmission(e) {

        e.preventDefault();

        let form = document.querySelector("form");
        let password = form.password.value;

        let passwordError = document.querySelector(".passwordError");
        try {
            const res = await fetch("/checkPassword", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include', // Ensure cookies are sent
                body: JSON.stringify({ id: user._id, password })
            });
            const data = await res.json();
            if (data.token) {
                window.location.assign(`/changeUserPassword/${data.token}`);
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

    async function changee()  {
        await fetch("/createVerificationCode", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: user._id, username: user.username, email: user.email })
        });
    }

    return <div className="checkPassword">
        <form onSubmit={handleSubmission} style={{ position: "relative" }}>
            <input type="password" name="password" placeholder="اكتب كلمة مرورك" />
            <p className="passwordError" style={{ margin: "15px" }}></p>
            <Link to="/changePassword" onClick={changee} style={{ position: "absolute", bottom: '-50px', fontSize: "27px", color: "white" }}>نسيت كلمة المرور</Link>
            <input type="submit" value="ارسل" />
        </form>
    </div>;
}