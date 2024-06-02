import { useState, useEffect } from 'react';
import defaultImg from '../imgs/download.png';

export default function Services({ user }) {
    let [services, setServices] = useState([]);

    useEffect(() => {
        async function getData() {
            try {
                const res = await fetch("/getServices", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id: user._id })
                });
                
                const data = await res.json();

                setServices(data.services);

            } catch (e) {
                console.log(e);
            }
        }
        getData();
    }, []);

    return <div className="services">

{services.map(service =>  <div className="service">
<div className="serviceOwner">
    <img src={service.ServiceOwnerPicture} alt="" className='serviceOwnerPicture' onClick={_ => window.location.assign(`/userProfile/${service.ServiceOwner}`)} />
    <strong>{service.ServiceOwnerName}</strong>
</div>
<img src={service.serviceImgs[0].url} alt="" className='serviceImg'/>
<div className="serviceInfoo">
    <strong>{service.serviceUsername}</strong>
    <p style={{ cursor: "pointer" }} onClick={() => window.location.assign(`/serviceInfo/${service._id}`)}>SeeMore</p>
    <strong>{service.servicePrice} $</strong>
</div>
</div> )}

    </div>
}




