import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import './Search.scss';

export default function Search ({setSearchTerm,searchTerm,placeholder}) {
  return (
  <div className="search-row">
    <div className="search-wrapper">
            <FontAwesomeIcon icon={faSearch} className = "search-icon" />
            <input
              type="text"
              className="form-control search-input"
              placeholder= {placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
    </div>
  </div>
  );
}