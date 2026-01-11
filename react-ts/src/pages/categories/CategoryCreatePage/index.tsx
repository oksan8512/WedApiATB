import {useState} from "react";
import {useNavigate} from "react-router";
// import api from "../../../api";
import {useCategoryCreateMutation} from "../../../services/apiCategory.ts";
import type {ICategoryCreate} from "../../../types/category/ICategoryCreate.ts";

// interface Props {
//     name: string;
//     image: null | File;
// }

const CategoryCreatePage = () => {

    const [form, setForm] = useState<ICategoryCreate>({
        name: "",
        image: null,
    });

    const [categoryCreate] = useCategoryCreateMutation();

    const navigator = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm({
                ...form,
                image: file,
            });
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try
        {
            await categoryCreate(form);
            // await api.post(`categories`, form, {
            //     headers: {
            //         "Content-Type": "multipart/form-data",
            //     },
            // });
            navigator("/");
        }
        catch (e)
        {
            console.error("Problem with send data", e);
            alert("Problem with send data");
        }
    }

    return (
        <>
            <h1 className={"text-4xl font-extrabold dark:text-white text-center mb-8"}>Створення категорії</h1>

            <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
                <div className="relative z-0 w-full mb-5 group">
                    <input type="text" name="name" id="name"
                           onChange={handleChange}
                           className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                           placeholder=" "/>
                    <label htmlFor="name"
                           className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                        Назва
                    </label>
                </div>

                <div className="flex items-center justify-center w-full mb-5">
                    <label htmlFor="dropzone-file"
                           className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {form.image ?
                                <img src={URL.createObjectURL(form.image)} className="w-16 h-16 mb-4 object-cover"
                                     alt="salo"/>
                                :
                                <svg className="w-16 h-16 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                     xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                          stroke-width="2"
                                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                            }

                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span
                                className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX.
                                800x400px)</p>
                        </div>
                        <input id="dropzone-file" onChange={handleImageChange} type="file" className="hidden"/>
                    </label>
                </div>


                <button type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Додати
                </button>
            </form>
        </>
    )
}

export default CategoryCreatePage;