export default function ChangeUsername({ user }) {

    async function handleSubmission(e) {
        e.preventDefault();

        let form = document.querySelector("form");
        let username = form.username.value;

        let passwordError = document.querySelector(".passwordError");
        try {
            const res = await fetch("/usernameEdit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: user._id, username })
            });

            const data = await res.json();

            if (data.changed) {
                window.location.assign("/");
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

    return <div className="checkPassword">
    <form onSubmit={handleSubmission}>
        <input type="text" name="username" placeholder="اكتب اسمك الجديد" />
        <p className="passwordError" style={{ margin: "15px", color: "red" }}></p>
        <input type="submit" value="ارسل" />
    </form>
</div>
}