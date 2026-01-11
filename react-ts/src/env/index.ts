const API_URL = import.meta.env.VITE_API_URL;
const API_IMAGE_URL = `${API_URL}/images/`;
const API_IMAGE_SMALL_URL = `${API_IMAGE_URL}200_`;


const APP_ENV = {
    API_URL,
    API_IMAGE_URL,
    API_IMAGE_SMALL_URL
}

export default APP_ENV;