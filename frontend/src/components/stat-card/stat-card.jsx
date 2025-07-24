import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./stat-card.scss";

export default function StatCard({ icon, value, label }) {
    return (
        <div className="stat-card">
        <div className="stat-icon">
            <FontAwesomeIcon icon={icon} />
        </div>
        <div className="stat-content">
            <h3>{value.toLocaleString()}</h3>
            <p>{label}</p>
        </div>
        </div>
    );
}