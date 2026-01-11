import { useState } from 'react';
import type { FC, FormEvent, ChangeEvent } from 'react';
import { InputText } from '../inputs';
import type { ILoginRequest } from '../../types/account/IAccountRegister.ts';

interface LoginFormProps {
    onSubmit: (data: ILoginRequest) => Promise<void>;
    onCancel?: () => void;
}

const LoginForm: FC<LoginFormProps> = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<ILoginRequest>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Валідація email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email обов'язковий";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Некоректний формат email";
        }

        // Валідація пароля
        if (!formData.password) {
            newErrors.password = "Пароль обов'язковий";
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
            await onSubmit({
                email: formData.email.trim(),
                password: formData.password,
            });

            // Очищення форми після успішного входу
            setFormData({
                email: '',
                password: '',
            });
        } catch (error: unknown) {
            if (error instanceof Error) {
                setErrors({ submit: error.message });
            } else {
                setErrors({ submit: 'Помилка при вході' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputText
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@email.com"
                error={errors.email}
                required
                disabled={isSubmitting}
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
                    placeholder="Введіть пароль"
                    disabled={isSubmitting}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
            </div>

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
                    {isSubmitting ? 'Вхід...' : 'Увійти'}
                </button>
            </div>
        </form>
    );
};

export default LoginForm;