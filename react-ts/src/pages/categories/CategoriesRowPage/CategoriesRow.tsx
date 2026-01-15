import type { ICategoryItem } from "../../../types/category/ICategoryItem.ts";
import APP_ENV from "../../../env";
import DeleteConfirmDialog from "../../../components/DeleteConfirmDialog";
import { Link } from "react-router-dom";
import { Edit } from "lucide-react";
import { useState } from "react";

interface Props {
    category: ICategoryItem;
}

const CategoryRow: React.FC<Props> = ({ category }) => {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    return (
        <>
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <td className="px-6 py-4">
                    <img src={`${APP_ENV.API_IMAGE_SMALL_URL}${category.image}`} alt={category.name} width={75}/>
                </td>
                <th scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {category.name}
                </th>
                <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <Link
                            to={`/edit/${category.id}`}
                            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition-colors"
                        >
                            <Edit size={16} />
                            Редагувати
                        </Link>
                        <button
                            onClick={() => setShowDeleteDialog(true)}
                            className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
                        >
                            Видалити
                        </button>
                    </div>
                </td>
            </tr>

            {showDeleteDialog && (
                <DeleteConfirmDialog
                    id={category.id}
                    onClose={() => setShowDeleteDialog(false)}
                />
            )}
        </>
    );
};

export default CategoryRow;