import { Link } from "react-router-dom";

export default function TalatatSettings({ user }) {
    return <div className="settings">
        <Link to="/changeImage">تغيير صورتك</Link>
        <Link to="/changeUsername">تغيير اسمك</Link>
        <Link to="/checkPassword">تغيير كلمة المرور</Link>
    </div>
}