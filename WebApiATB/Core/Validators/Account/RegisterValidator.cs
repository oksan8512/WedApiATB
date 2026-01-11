using Core.Models.Account;
using Domain.Entities.Identity;
using FluentValidation;
using Microsoft.AspNetCore.Identity;

namespace Core.Validators.Account;

public class RegisterValidator : AbstractValidator<RegisterModel>
{
    public RegisterValidator(UserManager<UserEntity> userManager)
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Електронна пошта є обов'язковою")
            .EmailAddress().WithMessage("Пошту вказано невірно")
            .DependentRules(() =>
            {
                RuleFor(x => x.Email)
                    .MustAsync(async (email, cancellation) =>
                    {
                        var user = await userManager.FindByEmailAsync(email);
                        return user == null;
                    }).WithMessage("Користувач з даною поштою уже зареєстрований");
            });

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Пароль є обов'язковим")
            .MinimumLength(6).WithMessage("Пароль повинен містити щонайменше 6 символів");

        RuleFor(x => x.Image)
            .NotEmpty().WithMessage("Файл зображення є обов'язковим");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("Ім'я є обов'язковим")
            .MaximumLength(50).WithMessage("Ім'я не може бути довшим за 50 символів");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Прізвище є обов'язковим")
            .MaximumLength(50).WithMessage("Прізвище не може бути довшим за 50 символів");
    }
}
