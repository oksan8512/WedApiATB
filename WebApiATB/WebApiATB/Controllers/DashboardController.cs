using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebApiATB.Controllers;

/// <summary>
/// Контролер для дашборда адмін-панелі
/// </summary>
[Route("api/[controller]")]
[ApiController]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Отримати статистику для дашборда
    /// </summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        try
        {
            var usersCount = await _context.Users.CountAsync();
            var categoriesCount = await _context.Categories.CountAsync(c => !c.IsDeleted);

            var stats = new
            {
                usersCount = usersCount,
                categoriesCount = categoriesCount,
                productsCount = 0, // TODO: Додати коли буде таблиця Products
                ordersCount = 0    // TODO: Додати коли буде таблиця Orders
            };

            return Ok(stats);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Отримати останні дії в системі
    /// </summary>
    [HttpGet("recent-activities")]
    public async Task<IActionResult> GetRecentActivities()
    {
        try
        {
            var activities = new List<object>();

            // Останні зареєстровані користувачі (без фільтра IsDeleted)
            var recentUsers = await _context.Users
                .OrderByDescending(u => u.DateCreated)
                .Take(3)
                .Select(u => new
                {
                    type = "user_registered",
                    message = $"Новий користувач: {u.FirstName} {u.LastName}",
                    timestamp = u.DateCreated,
                    icon = "user"
                })
                .ToListAsync();

            activities.AddRange(recentUsers);

            // Останні створені категорії
            var recentCategories = await _context.Categories
                .Where(c => !c.IsDeleted)
                .OrderByDescending(c => c.DateCreated)
                .Take(3)
                .Select(c => new
                {
                    type = "category_created",
                    message = $"Створено категорію: {c.Name}",
                    timestamp = c.DateCreated,
                    icon = "folder"
                })
                .ToListAsync();

            activities.AddRange(recentCategories);

            // Сортуємо всі активності за датою
            var sortedActivities = activities
                .OrderByDescending(a => ((dynamic)a).timestamp)
                .Take(10)
                .ToList();

            return Ok(sortedActivities);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Отримати статистику користувачів за ролями
    /// </summary>
    [HttpGet("users-by-role")]
    public async Task<IActionResult> GetUsersByRole()
    {
        try
        {
            var userRoles = await _context.UserRoles
                .Include(ur => ur.Role)
                .GroupBy(ur => ur.Role.Name)
                .Select(g => new
                {
                    role = g.Key,
                    count = g.Count()
                })
                .ToListAsync();

            return Ok(userRoles);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Отримати топ категорії
    /// </summary>
    [HttpGet("top-categories")]
    public async Task<IActionResult> GetTopCategories()
    {
        try
        {
            var topCategories = await _context.Categories
                .Where(c => !c.IsDeleted)
                .OrderByDescending(c => c.DateCreated)
                .Take(5)
                .Select(c => new
                {
                    id = c.Id,
                    name = c.Name,
                    image = c.Image,
                    dateCreated = c.DateCreated
                })
                .ToListAsync();

            return Ok(topCategories);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}