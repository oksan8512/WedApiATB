using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace Core.Services
{
    public interface ICreateAdminService
    {
        Task CreateDefaultAdminAsync();
    }

    public class CreateAdminService : ICreateAdminService
    {
        private readonly UserManager<UserEntity> _userManager;
        private readonly RoleManager<RoleEntity> _roleManager;
        private readonly IConfiguration _configuration;

        public CreateAdminService(
            UserManager<UserEntity> userManager,
            RoleManager<RoleEntity> roleManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        public async Task CreateDefaultAdminAsync()
        {
            try
            {
                Console.WriteLine(" Перевірка наявності адміністратора...");

                // Перевірка чи існує роль Admin
                var adminRoleExists = await _roleManager.RoleExistsAsync("Admin");
                if (!adminRoleExists)
                {
                    Console.WriteLine(" Створення ролі Admin...");
                    var adminRole = new RoleEntity { Name = "Admin" };
                    var roleResult = await _roleManager.CreateAsync(adminRole);

                    if (roleResult.Succeeded)
                    {
                        Console.WriteLine(" Роль Admin створена");
                    }
                    else
                    {
                        Console.WriteLine(" Помилка створення ролі: " + string.Join(", ", roleResult.Errors.Select(e => e.Description)));
                        return;
                    }
                }

                // Перевірка чи існує користувач Admin
                var adminEmail = _configuration["AdminCredentials:Email"] ?? "admin@atb.com";
                var adminUser = await _userManager.FindByEmailAsync(adminEmail);

                if (adminUser == null)
                {
                    Console.WriteLine(" Створення адміністратора...");

                    var admin = new UserEntity
                    {
                        UserName = adminEmail,
                        Email = adminEmail,
                        EmailConfirmed = true,
                        FirstName = "Admin",
                        LastName = "Administrator",
                        // Додайте інші необхідні поля з вашої UserEntity
                    };

                    var adminPassword = _configuration["AdminCredentials:Password"] ?? "Admin123!";
                    var createResult = await _userManager.CreateAsync(admin, adminPassword);

                    if (createResult.Succeeded)
                    {
                        Console.WriteLine(" Адміністратор створений");

                        // Додавання ролі Admin
                        var addToRoleResult = await _userManager.AddToRoleAsync(admin, "Admin");

                        if (addToRoleResult.Succeeded)
                        {
                            
                            Console.WriteLine(" Email: " + adminEmail);
                            Console.WriteLine(" Password: " + adminPassword);
                            Console.WriteLine(" ЗМІНІТЬ ПАРОЛЬ після першого входу!");
                            
                        }
                        else
                        {
                            Console.WriteLine(" Помилка призначення ролі: " + string.Join(", ", addToRoleResult.Errors.Select(e => e.Description)));
                        }
                    }
                    else
                    {
                        Console.WriteLine(" Помилка створення користувача: " + string.Join(", ", createResult.Errors.Select(e => e.Description)));
                    }
                }
                else
                {
                    Console.WriteLine(" Адміністратор вже існує: " + adminEmail);

                    // Перевірка чи має роль Admin
                    var isInRole = await _userManager.IsInRoleAsync(adminUser, "Admin");
                    if (!isInRole)
                    {
                        Console.WriteLine(" Додавання ролі Admin до існуючого користувача...");
                        await _userManager.AddToRoleAsync(adminUser, "Admin");
                        Console.WriteLine(" Роль Admin призначена");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($" Критична помилка: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
            }
        }
    }
}