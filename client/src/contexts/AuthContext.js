import React, { useState, useEffect, createContext } from "react";

const AuthContext = createContext();

function AuthContextProvider(props) {
    const [ LoggedIn, setLoggedIn ] = useState(undefined);
    const [ IsLoading, setIsLoading ] = useState(true);

    async function getLoggedIn() {
        try {
            const res = await fetch("/auth", {
                method: "GET",
                credentials: "include"
            });
            const data = await res.json();
            if (data.transfair) {
            setLoggedIn(data.transfair);
            } else {
            setLoggedIn(data.user);
            }
            setIsLoading(false);
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getLoggedIn();
    }, []);

    return <AuthContext.Provider value={{ LoggedIn, getLoggedIn, IsLoading }}>
        {props.children}
    </AuthContext.Provider>
}

export { AuthContextProvider, AuthContext };