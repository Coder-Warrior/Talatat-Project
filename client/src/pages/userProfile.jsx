import { useParams, Navigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function UserProfile({ user }) {
    const { id } = useParams();

    let [IsLoading, setIsLoading] = useState(true);
    let [notFound, updateNotFound] = useState(false);
    let [anotherUser, setAnotherUser] = useState({});

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
                setAnotherUser(data.user);
                setIsLoading(false);

            } else {
                updateNotFound(true);
                setIsLoading(false);
            }
        }
        getData();
    }, [])

    return IsLoading === false && notFound === true ? <Navigate to="/error404" /> : IsLoading === false && notFound === false ? <div className="user">
        <img src={anotherUser.image} alt="" />
        <h1>{anotherUser.username}</h1>
        <strong onClick={_ => window.location.assign(`/userServices/${anotherUser._id}`)}>الخدمات</strong>
        <strong onClick={_ => window.location.assign(`/chat/${anotherUser._id}`)}>تواصل معه</strong>
    </div> : <></>;
};