import {Link, Outlet} from "react-router";
import APP_ENV from "../../env";
import {useAppDispatch, useAppSelector} from "../../store";
import {logout} from "../../store/authSlice.ts";

const MainLayout = () => {

    const dispatch = useAppDispatch();
    const {user} = useAppSelector(state => state.auth);
    return (
        <>
            <div className={"p-5 bg-white dark:bg-gray-900 antialiased  min-h-screen"}>
                <div className="flex justify-between items-center">
                    <div className="flex">
                        <div className={"my-4 mx-4"}>
                            <Link to={"/"}
                                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                До хати
                            </Link>
                        </div>
                        <div className={"my-4 mx-4"}>
                            <Link to={"/create"}
                                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                Додати
                            </Link>
                        </div>
                    </div>
                    {user !== null ? (
                        <>
                            <div className="flex items-center gap-4">
                                <Link to={"/profile"}>
                                    <div className={"flex items-center gap-2 hover:opacity-80 transition-opacity"}>
                                        <img src={`${APP_ENV.API_IMAGE_SMALL_URL}${user.image}`}
                                             className={"w-[40px] h-[40px] rounded-lg"}
                                             alt={user.name}/>
                                        <p className={"text-white"}>{user.name}</p>
                                    </div>
                                </Link>

                                <button
                                    onClick={() => {
                                        dispatch(logout());
                                    }}
                                    className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    Вихід
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex">
                            <div className={"my-4 mx-4"}>
                                <Link to={"/login"}
                                      className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    Увійти
                                </Link>
                            </div>
                            <div className={"my-4 mx-4"}>
                                <Link to={"/register"}
                                      className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    Зареєструватися
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                <Outlet/>
            </div>
        </>
    )
}

export default MainLayout;