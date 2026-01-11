// Розташування: src/components/forms/CategoryForm.tsx

import { useState } from 'react';
import type { FC, FormEvent, ChangeEvent } from 'react';
import { InputText, InputFile } from '../inputs';

interface ICategoryCreate {
    name: string;
    image: File | null;
}

interface CategoryFormProps {
    initialData?: {
        id?: number;
        name: string;
        image?: string;
    };
    onSubmit: (data: ICategoryCreate) => Promise<void>;
    onCancel?: () => void;
    isEdit?: boolean;
}

const CategoryForm: FC<CategoryFormProps> = ({
                                                 initialData,
                                                 onSubmit,
                                                 onCancel,
                                                 isEdit = false,
                                             }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
    });

    const [file, setFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (newFile: File | null) => {
        setFile(newFile);

        if (errors.image) {
            setErrors(prev => ({ ...prev, image: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Назва категорії обов\'язкова';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Назва має містити мінімум 2 символи';
        } else if (formData.name.length > 100) {
            newErrors.name = 'Назва не може перевищувати 100 символів';
        }

        if (!isEdit && !file) {
            newErrors.image = 'Зображення обов\'язкове';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData: ICategoryCreate = {
                name: formData.name.trim(),
                image: file,
            };

            await onSubmit(submitData);

            if (!isEdit) {
                setFormData({ name: '' });
                setFile(null);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ submit: error.message });
            } else {
                setErrors({ submit: 'Помилка при збереженні' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputText
                label="Назва категорії"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Введіть назву категорії"
                error={errors.name}
                required
                disabled={isSubmitting}
                maxLength={100}
            />

            <InputFile
                label="Зображення категорії"
                name="image"
                onChange={handleFileChange}
                preview={initialData?.image}
                error={errors.image}
                helperText="Формати: JPG, PNG, WEBP, GIF. Максимальний розмір: 5 MB"
                required={!isEdit}
                disabled={isSubmitting}
                accept="image/*"
                allowedExtensions={['.jpg', '.jpeg', '.png', '.webp', '.gif']}
                maxSize={5 * 1024 * 1024}
            />

            {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        Скасувати
                    </button>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Збереження...' : (isEdit ? 'Оновити' : 'Створити')}
                </button>
            </div>
        </form>
    );
};

export default CategoryForm;