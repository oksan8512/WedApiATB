import axios from "axios";
import APP_ENV from "../env";

// створюємо екземпляр axios
const api = axios.create({
    baseURL: `${APP_ENV.API_URL}/api/`, // 🔹 базова адреса API
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;