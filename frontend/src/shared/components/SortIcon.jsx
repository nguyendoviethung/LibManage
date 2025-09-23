import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

export default function SortIcon({ currentKey, sortKey, direction }) {
  if (currentKey !== sortKey) return (
    <FontAwesomeIcon icon={faSort} className="sort-icon inactive" />
  );
  if (direction === 'asc') return (
    <FontAwesomeIcon icon={faSortUp} className="sort-icon asc" />
  );
  if (direction === 'desc') return (
    <FontAwesomeIcon icon={faSortDown} className="sort-icon desc" />
  );
  return null;
}



