import { useState, useEffect } from 'react';
export default function PendingRequests({ user }) {
    let [users, setUsers] = useState([]);
    useEffect(() => {
        async function GetRequesters() {
            try {
                const res = await fetch("/getRequests", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id: user._id })
                });
                const data = await res.json();
                console.log(data);
                setUsers(data.users);
            } catch (e) {
                console.log(e);
            }
        }
        GetRequesters();
    }, []);
    return <div className="users">
        {
            users.map(user => 
            <div className='requester'>
                    <img src={user.image} onClick={() => window.location.assign(`/userProfile/${user.Requester}`)}></img>
                    <h3>{user.username}</h3>
                    <strong>{user.serviceName}</strong>
                </div>
        )
        }
    </div>
}