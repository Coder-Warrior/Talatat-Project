import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();


export default function People({ user }) {
    let [people, updatePeople] = useState([]);

    useEffect(() => {
        async function getPeople() {
            try {
                const res = await fetch("/getPeople", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id: user._id })
                });
                const data = await res.json();
                updatePeople(data.people);
            } catch (e) {
                console.log(e);
            }
        }
        getPeople();
    }, []);

    useEffect(() => {
        socket.on("msgSentSuccessfully", async (val) => {
            if (val.messageFrom === user._id || val.messageTo === user._id) {
              let users = people.filter(user => user._id === val.messageFrom || user._id === val.messageTo);
              if (users.length < 1) {
                if (val.messageFrom === user._id) {
                    const res = await fetch("/getUser", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ id: val.messageTo })
                    });
                    const data = await res.json();
                    updatePeople([...people, data.user]);
                } else if (val.messageTo === user._id) {
                    const res = await fetch("/getUser", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ id: val.messageFrom })
                    });
                    const data = await res.json();
                    updatePeople([...people, data.user]);
                }
              }
            }
        });
    })

    return <div className="users">
    {
        people.map(user => 
        <div className='requester'>
                <img src={user.image} onClick={() => window.location.assign(`/userProfile/${user._id}`)}></img>
                <h3>{user.username}</h3>
            </div>
    )
    }
</div>

}