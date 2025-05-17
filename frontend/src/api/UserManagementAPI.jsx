import axios from 'axios';

//Đường dẫn đến API
const BASE_URL = 'http://localhost/LibManage/backend/api/reader-management';

export const listUser = () => axios.post(`${BASE_URL}/list-reader.php`).then(res => res.data);
