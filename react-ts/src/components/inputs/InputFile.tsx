import { useState, useRef, type FC, type DragEvent } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';

interface InputFileProps {
    label: string;
    name: string;
    onChange: (file: File | null) => void;
    preview?: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    disabled?: boolean;
    accept?: string;
    allowedExtensions?: string[];
    maxSize?: number;
}

const InputFile: FC<InputFileProps> = ({
                                           label,
                                           name,
                                           onChange,
                                           preview,
                                           error,
                                           helperText,
                                           required = false,
                                           disabled = false,
                                           accept = 'image/*',
                                           allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
                                           maxSize = 5 * 1024 * 1024,
                                       }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [validationError, setValidationError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): boolean => {
        setValidationError('');

        const extension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!allowedExtensions.includes(extension)) {
            setValidationError(`Дозволені формати: ${allowedExtensions.join(', ')}`);
            return false;
        }

        if (file.size > maxSize) {
            const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
            setValidationError(`Файл занадто великий. Максимум: ${maxSizeMB} MB`);
            return false;
        }

        return true;
    };

    const handleFileChange = (file: File | null) => {
        if (!file) {
            setPreviewUrl(null);
            setValidationError('');
            onChange(null);
            return;
        }

        if (!validateFile(file)) {
            onChange(null);
            return;
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onChange(file);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        handleFileChange(file);
    };

    const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (disabled) return;

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileChange(file);
        }
    };

    const handleRemove = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setValidationError('');
        onChange(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const displayPreview = previewUrl || preview;
    const currentError = error || validationError;

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className="flex items-center justify-center w-full">
                <label
                    htmlFor={name}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                        ${isDragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : currentError
                            ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20'
                            : 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
                    }
                        ${!disabled && !currentError ? 'hover:bg-gray-100 dark:hover:bg-gray-600' : ''}`}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 relative">
                        {displayPreview ? (
                            <>
                                <img
                                    src={displayPreview}
                                    alt="Preview"
                                    className="w-32 h-32 object-cover rounded-lg mb-3"
                                />
                                {!disabled && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRemove();
                                        }}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        aria-label="Видалити файл"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                <Upload className={`w-10 h-10 mb-3 ${currentError ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`} />
                                <p className={`mb-2 text-sm ${currentError ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                    <span className="font-semibold">Натисніть для вибору</span> або перетягніть файл
                                </p>
                                {helperText && !currentError && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center px-4">
                                        {helperText}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        id={name}
                        name={name}
                        type="file"
                        className="hidden"
                        accept={accept}
                        onChange={handleInputChange}
                        disabled={disabled}
                        required={required && !displayPreview}
                    />
                </label>
            </div>

            {currentError && (
                <div className="mt-2 flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>{currentError}</span>
                </div>
            )}
        </div>
    );
};

export default InputFile;