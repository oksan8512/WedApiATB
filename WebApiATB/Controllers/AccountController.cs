using AutoMapper;
using Core.Constants;
using Core.Interfaces;
using Core.Models.Account;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace WebApiATB.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController(
        UserManager<UserEntity> userManager,
        IImageService imageService,
        IMapper mapper,
        IJwtTokenService jwtTokenService) : ControllerBase
    {
        /// <summary>
        /// Реєстрація нового користувача
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Register([FromForm] RegisterModel model)
        {
            // Валідація моделі
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = mapper.Map<UserEntity>(model);

            // Збереження зображення
            if (model.Image != null)
            {
                try
                {
                    user.Image = await imageService.SaveImageAsync(model.Image);
                }
                catch (Exception ex)
                {
                    return BadRequest(new { message = "Помилка при збереженні зображення", error = ex.Message });
                }
            }

            // Створення користувача
            var createResult = await userManager.CreateAsync(user, model.Password);
            if (!createResult.Succeeded)
            {
                return BadRequest(new
                {
                    message = "Не вдалося створити користувача",
                    errors = createResult.Errors.Select(e => new { e.Code, e.Description })
                });
            }

            // Додавання ролі
            var roleResult = await userManager.AddToRoleAsync(user, Roles.User);
            if (!roleResult.Succeeded)
            {
                // Опціонально: видалити користувача, якщо роль не додалася
                await userManager.DeleteAsync(user);
                return BadRequest(new
                {
                    message = "Не вдалося призначити роль",
                    errors = roleResult.Errors.Select(e => new { e.Code, e.Description })
                });
            }

            // Генерація JWT токена
            var token = await jwtTokenService.CreateTokenAsync(user);

            // Повертаємо ТОКЕН і ДАНІ користувача
            return Ok(new
            {
                token,
                user = new
                {
                    id = user.Id,
                    email = user.Email,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    image = user.Image
                }
            });
        }

        /// <summary>
        /// Вхід користувача в систему
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest(new { message = "Користувача з такою поштою не знайдено" });
            }

            var isPasswordValid = await userManager.CheckPasswordAsync(user, model.Password);
            if (!isPasswordValid)
            {
                return BadRequest(new { message = "Невірний пароль" });
            }

            var token = await jwtTokenService.CreateTokenAsync(user);

            return Ok(new
            {
                token,
                user = new
                {
                    id = user.Id,
                    email = user.Email,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    image = user.Image
                }
            });
        }
    }
}