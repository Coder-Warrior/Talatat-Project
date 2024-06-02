import { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';

export default function EmailVerification() {

    let [IsLoading, setIsLoading] = useState(true);
    let [check, setCheck] = useState(false);
    let [endsAt, setEndsAt] = useState(0);
    const { id } = useParams();
    
    useEffect(() => {
        async function checkForUrl() {

            const res = await fetch("/checkForUrl/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            });
            const data = await res.json();

            if (data.Found === true) {
                setCheck(true);
                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        }
        checkForUrl();
    }, []);

    async function handleVerification(e) {
        e.preventDefault();
        let form = document.querySelector("form");
        let vcode = form.verificationCode.value;
        let verror = document.querySelector(".emailVerificationError");

        const res = await fetch(`/verifypls`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ vcode, id })
        });
        
        const data = await res.json();

        if (data.match === true) {
            window.location.assign("/");
        } else if (data.match === false) {
            verror.textContent = "رمز تحقق غير صحيح"
        }

    }

    async function handleReSend(e) {
        e.preventDefault();
        let verror = document.querySelector(".emailVerificationErrorr");
            try {
                const res = await fetch('/resendEmail', {
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

    return IsLoading === false && check === true ? <div className="emailverification">
        <h2>لقد ارسلنا رمز على بريدك الالكتروني للتحقق من ملكيته</h2>
        <form method="POST" onSubmit={handleVerification}>
            <input type="text" name="verificationCode" placeholder="رمز التحقق" />
            <p className="emailVerificationError"></p>
            <input type="submit" value="تاكيد" />
        </form>
        <form onSubmit={handleReSend}>
            <input type="submit" value="اعادة ارسال الرمز" style={{width: "200px"}} />
            <p className="emailVerificationErrorr"></p>
        </form>
    </div> : IsLoading === false && check === false ? <Navigate to="/error404" /> : <></>;
}