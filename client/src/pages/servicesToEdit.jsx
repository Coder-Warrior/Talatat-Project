import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

export default function ServicesToEdit({ user }) {
    let [services, setServices] = useState([]);
    let [IsLoading, setIsLoading] = useState(true);
    let [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function getData() {
            try {
                const res = await fetch("/getUserServicess", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id: user._id })
                });
                const data = await res.json();
                console.log(data);
                if (data.services) {
                    setServices(data.services);
                    setIsLoading(false);
                } else {
                    setNotFound(true);
                    setIsLoading(false);
                }

            } catch (e) {
                console.log(e);
            }
        }
        getData();
    }, []);

    return IsLoading === false && notFound === false ? <div className="services">

{services.map(service =>  <div className="service">
<div className="serviceOwner">
    <img src={service.ServiceOwnerPicture} alt="" className='serviceOwnerPicture' onClick={_ => window.location.assign(`/userProfile/${service.ServiceOwner}`)} />
    <strong>{service.ServiceOwnerName}</strong>
</div>
<img src={service.serviceImgs[0].url} alt="" className='serviceImg'/>
<div className="serviceInfoo" style={{ position: "relative" }}>
    <strong>{service.serviceUsername}</strong>
    <p>SeeMore</p>
    <strong>{service.servicePrice} $</strong>
    <strong style={{ position: "absolute", right: "20px", top: "0", cursor: "pointer"}} onClick={() => window.location.assign(`/editService/${service._id}`)}>تعديل</strong>
</div>
</div> )}

    </div> : IsLoading === false && notFound === true ? <Navigate to="/error404" /> : <></>;
}