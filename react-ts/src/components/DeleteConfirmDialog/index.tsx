import { useState } from "react";

interface DeleteConfirmDialogProps {
    id: number;
    onClose: () => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({ id, onClose }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            // Your delete logic here
            console.log(`Deleting category with id: ${id}`);
            // await deleteCategory(id);
            onClose();
        } catch (error) {
            console.error("Error deleting category:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Підтвердження видалення
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Ви впевнені, що хочете видалити цю категорію? Цю дію неможливо скасувати.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                    >
                        Скасувати
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                        {isDeleting ? "Видалення..." : "Видалити"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmDialog;