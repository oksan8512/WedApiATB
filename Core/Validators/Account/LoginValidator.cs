using Core.Models.Account;
using Domain.Entities.Identity;
using FluentValidation;
using Microsoft.AspNetCore.Identity;

namespace Core.Validators.Account;

public class LoginValidator : AbstractValidator<LoginModel>
{
    public LoginValidator(UserManager<UserEntity> userManager)
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Електронна пошта є обов'язковою")
            .EmailAddress().WithMessage("Некоректний формат електронної пошти")
            .MustAsync(async (email, cancellation) =>
            {
                var user = await userManager.FindByEmailAsync(email);
                return user != null;
            }).WithMessage("Користувача з такою поштою не знайдено");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Пароль є обов'язковим")
            .MinimumLength(6).WithMessage("Пароль повинен містити щонайменше 6 символів");

        RuleFor(x => x)
            .MustAsync(async (model, cancellation) =>
            {
                var user = await userManager.FindByEmailAsync(model.Email);
                if (user == null) return false;
                return await userManager.CheckPasswordAsync(user, model.Password);
            })
            .WithMessage("Невірний email або пароль");
    }
}