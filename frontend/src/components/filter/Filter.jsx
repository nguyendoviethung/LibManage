import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Form} from "react-bootstrap";
import './Filter.scss';

export default function Filter({icon, filterTitle, filterName,setFilter, uniqueKeyword}) {
    return(
    <div className="filter-group">
        <div className="filter-label">
          <FontAwesomeIcon icon={icon} className="filter-icon" />
          <span> {filterTitle} </span>
        </div>
        <Form.Select value={filterName} onChange={e => setFilter(e.target.value)}>
          { uniqueKeyword.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </Form.Select>
    </div>
    )
}