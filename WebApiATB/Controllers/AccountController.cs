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
    public class AccountController(UserManager<UserEntity> userManager,
        IImageService imageService, IMapper mapper,
        IJwtTokenService jwtTokenService) : ControllerBase
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
                    return Ok();
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
            return Ok(new
            {
                token,
            });
        }
    }
}
