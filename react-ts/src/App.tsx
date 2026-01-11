import './App.css'
import CategoriesListPage from "./pages/categories/CategoriesListPage";
import CategoryCreatePage from "./pages/categories/CategoryCreatePage";
import {Route, Routes} from "react-router";
import MainLayout from "./components/MainLayout";
import LoginPage from "./pages/accounts/LoginPage/LoginPage.tsx";
import RegisterPage from "./pages/accounts/RegisterPage/RegisterPage.tsx";
import GoogleCallback from "./pages/accounts/GoogleCallback/GoogleCallback.tsx";

function App() {

    return (
        <Routes>
            <Route path={"/"} element={<MainLayout/>}>
                <Route index element={<CategoriesListPage/>}/>
                <Route path={"create"} element={<CategoryCreatePage/>}/>
                <Route path={"login"} element={<LoginPage />}/>
                <Route path={"register"} element={<RegisterPage />}/>
                <Route path={"google-callback"} element={<GoogleCallback />}/>
            </Route>
        </Routes>
    )
}

export default App