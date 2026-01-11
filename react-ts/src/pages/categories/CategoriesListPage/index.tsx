import CategoryRow from "../CategoriesRowPage/CategoriesRow.tsx";
import { useGetCategoriesQuery } from "../../../services/apiCategory.ts";

const CategoriesListPage = () => {
    const { data: categories, isLoading, error } = useGetCategoriesQuery();

    console.log("loading", isLoading);
    console.log("error", error);

    return (
        <>
            <div className="mb-6">
                <h1 className="text-4xl font-extrabold dark:text-white">Список категорій</h1>
            </div>

            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Фото
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Назва
                        </th>
                        <th scope="col" className="px-6 py-3">
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories?.map((category) =>
                        <CategoryRow key={category.id} category={category} />
                    )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default CategoriesListPage;