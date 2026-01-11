using Core.Models.Category;
using FluentValidation;

namespace Core.Validators;

public class CategoryUpdateModelValidator : AbstractValidator<CategoryUpdateModel>
{
    public CategoryUpdateModelValidator()
    {
        // Прибрали валідацію ID, бо він тепер приходить з URL, а не з body
        // RuleFor(x => x.Id)
        //     .GreaterThan(0).WithMessage("ID категорії має бути більше 0");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Назва категорії обов'язкова")
            .MinimumLength(2).WithMessage("Назва має містити мінімум 2 символи")
            .MaximumLength(100).WithMessage("Назва не може перевищувати 100 символів");

        RuleFor(x => x.Image)
            .Must(BeAValidImage).WithMessage("Файл має бути зображенням (jpg, jpeg, png, webp, gif)")
            .Must(BeAValidSize).WithMessage("Розмір файлу не може перевищувати 5 MB")
            .When(x => x.Image != null);
    }

    private bool BeAValidImage(Microsoft.AspNetCore.Http.IFormFile? file)
    {
        if (file == null) return true;

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        return allowedExtensions.Contains(extension);
    }

    private bool BeAValidSize(Microsoft.AspNetCore.Http.IFormFile? file)
    {
        if (file == null) return true;

        const int maxFileSize = 5 * 1024 * 1024; // 5 MB
        return file.Length <= maxFileSize;
    }
}