import { useParams, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

export default function Chat({ user }) {
    const { id } = useParams();

    let [IsLoading, setIsLoading] = useState(true);
    let [notFound, updateNotFound] = useState(false);
    let [anotherUser, setAnotherUser] = useState({});
    let [msgs, updateMsgs] = useState([]);

    useEffect(() => {
        async function getData() {
            const res = await fetch("/getUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id })
            });
            const data = await res.json();

            if (data.user) {
                const res = await fetch("/getMessages", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ userId: user._id, anotherUserId: data.user._id })
                });
                const dataa = await res.json();
                console.log(dataa.msgs);
                updateMsgs(dataa.msgs);
                setAnotherUser(data.user);
                setIsLoading(false);
            } else {
                updateNotFound(true);
                setIsLoading(false);
            }
        }

        getData();
    }, [])

    async function handleSubmission(e) {
        e.preventDefault();
        let form = document.querySelector("form");
        let message = form.textMsg.value;
        let files = document.querySelector("#files");
        try {
            if (message.length > 0) {
            socket.emit("msgSent", { from: user._id, to: anotherUser._id, message });
            }
            let filess = [];
            for (let i = 0; i < files.files.length; i++) {
                filess.push(files.files[i]);
            } 
            if (filess.length > 0) {
                socket.emit("msgSent", { from: user._id, to: anotherUser._id, filess });
            }
            form.reset();
        } catch (e) {
            console.log(e);
        }
    }

     useEffect(() => {
        socket.on("msgSentSuccessfully", (val) => {
            if ((val.messageFrom === user._id && val.messageTo === anotherUser._id) || (val.messageFrom === anotherUser._id && val.messageTo === user._id)) {
                updateMsgs([...msgs, val]);
            }
        })
     })
    return IsLoading === false && notFound === true ? <Navigate to="/error404" /> : IsLoading === false && notFound === false ? <div className="chat">
        <header>
            <img src={anotherUser.image} alt="" />
            <h1>{anotherUser.username}</h1>
        </header>
        <div className="messages">
            {msgs.map(msg => {
                if (msg.message) {
                    if (msg.messageFrom === user._id) {
                        return <p className="from">{msg.message}</p>
                    } else {
                        return <div className="to">
                            <p>{msg.message}</p>
                        </div>
                    }
                } else {
                    if (msg.messageFrom === user._id) {
                        if (msg.urls.length === 1) {
                            return <img src={msg.urls[0].url} alt="img" className='onlyFromImg'></img>
                        } else {
                            return <div className="from">
                                {msg.urls.map(url => <img src={url.url} className="fromImg"></img>)}
                            </div>
                        }
                    } else {
                        if (msg.urls.length === 1) {
                            return <div className="onlyToImgHolder">
                                <img src={msg.urls[0].url} alt="img" className='onlyToImg'></img>
                            </div>
                        } else {
                            return <div className="to">
                                <div className="toImages">
                                {msg.urls.map(url => <img src={url.url} className="ToImg"></img>)}
                                </div>
                            </div>
                        }
                    }
                }
            }
        )}
        </div>
        <form encType="multipart/form-data" onSubmit={handleSubmission}>
            <input type="text" name="textMsg" />
            <input type="file" id="files" multiple accept='image/jpeg,image/png' />
            <input type="submit" value="ارسل" />
        </form>
    </div> : <></>;
}

