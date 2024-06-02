import { useEffect, useState, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function ServiceInfo({ user }) {
    const { id } = useParams();

    let [IsLoading, setIsLoading] = useState(true);
    let [notFound, setNotFound] = useState(false);
    let [service, setService] = useState({});
    let [index, setIndex] = useState(0);
    let [requested, updateRequest] = useState(false);

    useEffect(() => {
        async function getServiceInfo() {
            try {
                const res = await fetch("/getService", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id })
                });
                const data = await res.json();
                if (data.service) {
                    setService(data.service);
                    setIsLoading(false);
                    updateRequest(data.reqFound);
                } else {
                    setNotFound(true);
                    setIsLoading(false);
                }
            } catch (e) {
                console.log(e);
            }
        }
        getServiceInfo();
    }, []);

    function incIndex() {
        if (index < 3) {
            setIndex(index+1);
        }
    }

    function decIndex() {
        if (index > 0) {
            setIndex(index-1)
        } 
    }

    async function addRequest(serviceName) {
        updateRequest(true);
        try {
            await fetch("/createRequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ Requester: user._id, requestReciver: service.ServiceOwner, serviceName, serviceId: service._id })
            });
        } catch (e) {
            console.log(e);
        }
    }

    async function deleteRequest() {
        updateRequest(false);
        try {
            await fetch("/createRequest", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ Requester: user._id })
            });
        } catch (e) {
            console.log(e);
        }
    }

    return IsLoading === false && notFound === false ? <div className="serviceInfo">
        <div className="title">
            <h1>{service.serviceUsername}</h1>
            <h3>{service.serviceDescription}</h3>
        </div>
        <div className="serviceGallery">
            <FontAwesomeIcon icon={faArrowRight} className="rightArrow" onClick={incIndex} />
            <img src={service.serviceImgs[index].url}></img>
            <FontAwesomeIcon icon={faArrowLeft}  className="leftArrow" onClick={decIndex} />
        </div>
        <strong>{service.servicePrice} $</strong>
        {requested === false ? <button onClick={() => addRequest(service.serviceUsername)}>+</button> : <button onClick={deleteRequest}>-</button>} 
    </div> :
     IsLoading === false && notFound === true ?
    <Navigate to="/error404" /> :
     <></>;
}