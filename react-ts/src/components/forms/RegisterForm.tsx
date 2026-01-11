import { useState } from 'react';
import type { FC, FormEvent, ChangeEvent } from 'react';
import { InputText, InputFile } from '../inputs';
import type { IRegisterRequest } from '../../types/account/IAccountRegister.ts';

interface RegisterFormProps {
    onSubmit: (data: IRegisterRequest) => Promise<void>;
    onCancel?: () => void;
    isLoading?: boolean;
}

// Оновлений компонент з правильною типізацією

const RegisterForm: FC<RegisterFormProps> = ({ onSubmit, onCancel, isLoading = false }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [photo, setPhoto] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handlePhotoChange = (newFile: File | null) => {
        setPhoto(newFile);

        if (errors.photo) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.photo;
                return newErrors;
            });
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Валідація імені
        if (!formData.firstName.trim()) {
            newErrors.firstName = "Ім'я обов'язкове";
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = "Ім'я має містити мінімум 2 символи";
        }

        // Валідація прізвища
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Прізвище обов'язкове";
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = "Прізвище має містити мінімум 2 символи";
        }

        // Валідація email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email обов'язковий";
        } else if (!emailRegex.test(formData.email.trim())) {
            newErrors.email = "Некоректний формат email";
        }

        // Валідація пароля
        if (!formData.password) {
            newErrors.password = "Пароль обов'язковий";
        } else if (formData.password.length < 6) {
            newErrors.password = "Пароль має містити мінімум 6 символів";
        }

        // Підтвердження пароля
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Підтвердження пароля обов'язкове";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Паролі не збігаються";
        }

        // Валідація фото
        if (!photo) {
            newErrors.photo = "Фото обов'язкове";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Очищуємо попередню помилку submit
        if (errors.submit) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.submit;
                return newErrors;
            });
        }

        if (!validate()) {
            return;
        }

        try {
            if (!photo) {
                setErrors({ submit: 'Фото обов\'язкове' });
                return;
            }

            const submitData: IRegisterRequest = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                image: photo,
            };

            await onSubmit(submitData);

            // Очищення форми після успішної реєстрації
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
            });
            setPhoto(null);
            setErrors({});
        } catch (error: unknown) {
            console.error('Помилка при реєстрації:', error);

            // Обробка різних типів помилок
            if (error instanceof Error) {
                setErrors({ submit: error.message });
            } else if (error && typeof error === 'object' && 'data' in error) {
                const err = error as { data?: { message?: string; title?: string } };
                setErrors({
                    submit: err.data?.message || err.data?.title || 'Помилка при реєстрації'
                });
            } else {
                setErrors({ submit: 'Невідома помилка при реєстрації' });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputText
                    label="Ім'я"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Введіть ім'я"
                    error={errors.firstName}
                    required
                    disabled={isLoading}
                />

                <InputText
                    label="Прізвище"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Введіть прізвище"
                    error={errors.lastName}
                    required
                    disabled={isLoading}
                />
            </div>

            <InputText
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
                error={errors.email}
                required
                disabled={isLoading}
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Пароль *
                </label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Мінімум 6 символів"
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Підтвердження пароля *
                </label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Повторіть пароль"
                    disabled={isLoading}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
            </div>

            <InputFile
                label="Фото профілю"
                name="photo"
                onChange={handlePhotoChange}
                error={errors.photo}
                helperText="Формати: JPG, PNG, WEBP. Максимальний розмір: 5 MB"
                required
                disabled={isLoading}
                accept="image/*"
                allowedExtensions={['.jpg', '.jpeg', '.png', '.webp']}
                maxSize={5 * 1024 * 1024}
            />

            {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600 whitespace-pre-line">{errors.submit}</p>
                </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    >
                        Скасувати
                    </button>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Реєстрація...' : 'Зареєструватися'}
                </button>
            </div>
        </form>
    );
};

export default RegisterForm;