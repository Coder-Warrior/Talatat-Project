export default function Login() {

    async function handleSubmission(event) {
        event.preventDefault();

        let form = document.getElementsByTagName("form")[0];
        let email = form.email.value;
        let password = form.password.value;
    
        let emailError = document.querySelector('.emailError');
        let passwordError = document.querySelector(".passwordError");

        const res = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            credentials: 'include', // Ensure cookies are sent
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.user) {
            window.location.assign("/");
        } else {
            emailError.textContent = data.errors.email;
            passwordError.textContent = data.errors.password;
        }
    }

    return <div class="login">
        <h2>تسجيل الدخول</h2>
        <form method="POST" onSubmit={handleSubmission}>
            <input type="text" name="email" placeholder="اكتب بريدك الاكتروني" />
            <p className="emailError"></p>
            <input type="password" name="password" placeholder="اكتب كلمة المرور"/>
            <p className="passwordError"></p>
            <input type="submit" value="انشاء حساب" />
        </form>
    </div>;
}