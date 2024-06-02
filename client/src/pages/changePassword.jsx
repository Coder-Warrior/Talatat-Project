export default function ChangePassword({ user }) {
   
    const id  = user._id;

    async function handleVerification(e) {
        e.preventDefault();
        let form = document.querySelector("form");
        let vcode = form.verificationCode.value;
        let verror = document.querySelector(".emailVerificationError");

        const res = await fetch(`/verifyPasswordPls`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include', // Ensure cookies are sent
            body: JSON.stringify({ vcode, id })
        });
        
        const data = await res.json();

        if (data.match === true) {
            window.location.assign(`/changeUserPassword/${data.token}`);
        } else if (data.match === false) {
            verror.textContent = "رمز تحقق غير صحيح"
        }

    }
    
    async function handleReSend(e) {
        e.preventDefault();
        let verror = document.querySelector(".emailVerificationErrorr");
            try {
                const res = await fetch('/resendPassword', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id })
                });
                const data = await res.json();
    
                if (data.sent) {
                    verror.style.color = "white !important";
                    verror.textContent = "لقد ارسلنا رمز جديد";
                    setTimeout(() => {
                        verror.style.color = "red !important";
                        verror.textContent = "";
                    }, 3000);
              } else if (data.msg) {
                verror.style.color = "red !important";
                verror.textContent = data.msg;
                setTimeout(() => {
                    verror.textContent = "";
                }, 3000);
             }
    
            } catch (e) {
                console.log(e);
            }
        
    }

   return <div className="emailverification">
    <h2>لقد ارسلنا رمز على بريدك الالكتروني للتحقق لاعادة تعيين كلمة المرور</h2>
    <form method="POST" onSubmit={handleVerification}>
        <input type="password" name="verificationCode" placeholder="رمز التحقق" />
        <p className="emailVerificationError"></p>
        <input type="submit" value="تاكيد" />
    </form>
    <form onSubmit={handleReSend}>
        <input type="submit" value="اعادة ارسال الرمز" style={{width: "200px"}} />
        <p className="emailVerificationErrorr"></p>
    </form>
</div>
}