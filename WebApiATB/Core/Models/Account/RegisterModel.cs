using Microsoft.AspNetCore.Http;

namespace Core.Models.Account;

public class RegisterModel
{
    /// <summary>
    /// Пошта користувача
    /// </summary>
    /// <example>bib@gmail.com</example>
    public string Email { get; set; } = "";
    /// <summary>
    /// Ім'я користувача
    /// </summary>
    /// <example>Василь</example>
    public string FirstName { get; set; } = "";
    /// <summary>
    /// Прізвище
    /// </summary>
    /// <example>Дубко</example>
    public string LastName { get; set; } = "";
    /// <summary>
    /// Аватар користувача
    /// </summary>
    public IFormFile? Image { get; set; }
    /// <summary>
    /// Пароль
    /// </summary>
    /// <example>123456</example>
    public string Password { get; set; } = "";
}
