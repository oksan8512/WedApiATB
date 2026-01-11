import type { FC, ChangeEvent } from 'react';

interface InputTextProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    maxLength?: number;
    helperText?: string;
}

const InputText: FC<InputTextProps> = ({
                                           label,
                                           name,
                                           value,
                                           onChange,
                                           placeholder = '',
                                           error,
                                           required = false,
                                           disabled = false,
                                           maxLength,
                                           helperText,
                                       }) => {
    return (
        <div className="relative z-0 w-full group">
            <input
                type="text"
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                maxLength={maxLength}
                className={`block py-2.5 px-0 w-full text-sm bg-transparent border-0 border-b-2 appearance-none 
                    ${error
                    ? 'text-red-900 border-red-600 dark:text-red-500 dark:border-red-500 focus:border-red-600 dark:focus:border-red-500'
                    : 'text-gray-900 border-gray-300 dark:text-white dark:border-gray-600 focus:border-blue-600 dark:focus:border-blue-500'
                } 
                    focus:outline-none focus:ring-0 peer
                    disabled:opacity-50 disabled:cursor-not-allowed`}
            />
            <label
                htmlFor={name}
                className={`peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] 
                    peer-focus:start-0 rtl:peer-focus:translate-x-1/4 
                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
                    peer-focus:scale-75 peer-focus:-translate-y-6
                    ${error
                    ? 'text-red-600 dark:text-red-500 peer-focus:text-red-600 peer-focus:dark:text-red-500'
                    : 'text-gray-500 dark:text-gray-400 peer-focus:text-blue-600 peer-focus:dark:text-blue-500'
                }`}
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {error}
                </p>
            )}

            {helperText && !error && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    {helperText}
                </p>
            )}

            {maxLength && value.length > 0 && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                    {value.length} / {maxLength}
                </p>
            )}
        </div>
    );
};

export default InputText;