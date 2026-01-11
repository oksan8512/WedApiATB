import { useNavigate, useParams } from "react-router";
import CategoryForm from "../../../components/forms/CategoryForm.tsx";
import type { ICategoryCreate } from "../../../types/category/ICategoryCreate.ts";
import APP_ENV from "../../../env";

// Додайте цю мутацію в apiCategory.ts:
// categoryUpdate: builder.mutation<void, { id: number; data: ICategoryCreate }>({
//     query: ({ id, data }) => {
//         const formData = serialize(data);
//         return {
//             method: "PUT",
//             url: `${id}`,
//             body: formData
//         }
//     },
//     invalidatesTags: ["Categories"]
// }),

const CategoryEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigator = useNavigate();

    // Використовуйте useGetCategoryQuery(id) для отримання даних категорії
    // const { data: category, isLoading } = useGetCategoryQuery(Number(id));
    // const [categoryUpdate] = useCategoryUpdateMutation();

    // Приклад даних (замініть на реальні з API)
    const mockCategory = {
        id: Number(id),
        name: "Приклад категорії",
        image: "150_example.jpg"
    };

    const handleSubmit = async (data: ICategoryCreate) => {
        try {
            // await categoryUpdate({ id: Number(id), data }).unwrap();
            console.log("Оновлення категорії:", data);
            navigator("/");
        } catch (e) {
            console.error("Problem with update data", e);
            throw new Error("Помилка при оновленні категорії");
        }
    };

    const handleCancel = () => {
        navigator("/");
    };

    // if (isLoading) {
    //     return <div className="text-center py-8">Завантаження...</div>;
    // }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-4xl font-extrabold dark:text-white text-center mb-8">
                Редагування категорії
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <CategoryForm
                    initialData={{
                        id: mockCategory.id,
                        name: mockCategory.name,
                        image: `${APP_ENV.API_IMAGE_SMALL_URL}${mockCategory.image}`
                    }}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isEdit={true}
                />
            </div>
        </div>
    );
};

export default CategoryEditPage;