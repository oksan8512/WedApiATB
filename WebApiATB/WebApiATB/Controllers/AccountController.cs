using AutoMapper;
using Core.Constants;
using Core.Interfaces;
using Core.Models.Account;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace WebApiATB.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AccountController(
        UserManager<UserEntity> userManager,
        SignInManager<UserEntity> signInManager,
        IImageService imageService,
        IMapper mapper,
        IJwtTokenService jwtTokenService,
        IConfiguration configuration) : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Register([FromForm] RegisterModel model)
        {
            var user = mapper.Map<UserEntity>(model);
            if (model.Image != null)
            {
                user.Image = await imageService.SaveImageAsync(model.Image);
            }
            var result = await userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                result = await userManager.AddToRoleAsync(user, Roles.User);
                if (result.Succeeded)
                {
                    var token = await jwtTokenService.CreateTokenAsync(user);
                    return Ok(new { token });
                }
            }
            return BadRequest();
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return BadRequest();
            }
            var token = await jwtTokenService.CreateTokenAsync(user);
            return Ok(new { token });
        }

        [HttpGet]
        public IActionResult GoogleLogin()
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = Url.Action(nameof(GoogleCallback))
            };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet]
        public async Task<IActionResult> GoogleCallback()
        {
            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

            if (!result.Succeeded)
            {
                var frontendUrl = configuration["Frontend:Url"] ?? "http://localhost:5173";
                return Redirect($"{frontendUrl}/login");
            }

            var claims = result.Principal.Claims;
            var email = claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;
            var firstName = claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.GivenName)?.Value;
            var lastName = claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Surname)?.Value;
            var googleId = claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var picture = claims.FirstOrDefault(c => c.Type == "picture")?.Value;

            if (string.IsNullOrEmpty(email))
            {
                var frontendUrl = configuration["Frontend:Url"] ?? "http://localhost:5173";
                return Redirect($"{frontendUrl}/login");
            }

            // Перевіряємо чи користувач вже існує
            var user = await userManager.FindByEmailAsync(email);

            if (user == null)
            {
                // Створюємо нового користувача
                user = new UserEntity
                {
                    Email = email,
                    UserName = email,
                    FirstName = firstName,
                    LastName = lastName,
                    EmailConfirmed = true
                };

                // Зберігаємо аватар з Google якщо є
                if (!string.IsNullOrEmpty(picture))
                {
                    try
                    {
                        user.Image = await imageService.SaveImageFromUrlAsync(picture);
                    }
                    catch
                    {
                        // Якщо не вдалося завантажити аватар, просто продовжуємо
                    }
                }

                var createResult = await userManager.CreateAsync(user);
                if (createResult.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, Roles.User);

                    // Додаємо Google login до користувача
                    await userManager.AddLoginAsync(user, new UserLoginInfo(
                        GoogleDefaults.AuthenticationScheme,
                        googleId,
                        "Google"));
                }
                else
                {
                    var frontendUrl = configuration["Frontend:Url"] ?? "http://localhost:5173";
                    return Redirect($"{frontendUrl}/login");
                }
            }
            else
            {
                // Якщо користувач існує, перевіряємо чи є Google login
                var logins = await userManager.GetLoginsAsync(user);
                if (!logins.Any(l => l.LoginProvider == GoogleDefaults.AuthenticationScheme))
                {
                    // Додаємо Google login якщо його ще немає
                    await userManager.AddLoginAsync(user, new UserLoginInfo(
                        GoogleDefaults.AuthenticationScheme,
                        googleId,
                        "Google"));
                }
            }

            // Створюємо JWT токен
            var token = await jwtTokenService.CreateTokenAsync(user);

            // Перенаправляємо на frontend з токеном
            var frontendCallbackUrl = configuration["Frontend:Url"] ?? "http://localhost:5173";
            return Redirect($"{frontendCallbackUrl}/google-callback?token={token}");
        }
    }
}