import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

export default function App({ user }) {
    function handleBars() {
        let list = document.querySelector(".mainApp header .list");
        list.style.right = "0";
    }

    function exit() {
        let list = document.querySelector(".mainApp header .list");
        list.style.right = "-200px";
    }

    return <div className="mainApp">
        <header>
            <div className="userInfo">
                <img src={user.image} alt="" />
                <strong>{user.username}</strong>
            </div>
            <h1>Talatat</h1>
            <div className="info">
            <FontAwesomeIcon icon={faGear} className='icon' onClick={() => window.location.assign("/settings")} />
            <FontAwesomeIcon icon={faBars} className='icon' onClick={handleBars} />
            </div>
            <div className="list">
                <p onClick={exit}>X</p>
                <div className="userInfo">
                    <img src={user.image} alt="" />
                    <strong>{user.username}</strong>
                </div>
                <ul>
                    <li><Link to="/services">الخدمات</Link></li>
                    <li><Link to="/servicesToEdit">خدماتي</Link></li>
                    <li><Link to="/pendingRequests">الطلبات الواردة</Link></li>
                    <li><Link to="/Talatat">ما هو تلاتات</Link></li>
                    <li><Link to="/people">الناس</Link></li>
                    <li><Link to="/addService">+ اضف خدمة</Link></li>
                </ul>
            </div>
        </header>
    </div>
}