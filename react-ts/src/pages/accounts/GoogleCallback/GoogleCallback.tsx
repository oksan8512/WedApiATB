import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAppDispatch } from "../../../store";
import { login } from "../../../store/authSlice";

const GoogleCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            // Зберігаємо токен і авторизуємо користувача
            dispatch(login(token));
            navigate("/");
        } else {
            // Якщо токен не отримано, повертаємо на сторінку входу
            console.error("Токен не отримано від Google");
            navigate("/login");
        }
    }, [searchParams, dispatch, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Авторизація через Google...
                </p>
            </div>
        </div>
    );
};

export default GoogleCallback;