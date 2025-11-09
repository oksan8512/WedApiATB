using AutoMapper;
using AutoMapper.QueryableExtensions;
using Core.Interfaces;
using Core.Models.Category;
using Domain;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace WebApiATB.Controllers;

/// <summary>
/// Контролер для роботи з категоріями
/// </summary>
[Route("api/[controller]")]
[ApiController]
public class CategoriesController(AppDbContext appDbContext, IMapper mapper, IImageService imageService) : ControllerBase
{
    /// <summary>
    /// Отримати всі категорії
    /// </summary>
    /// <returns>Список категорій</returns>
    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var items = await appDbContext
            .Categories
            .Where(x => !x.IsDeleted)
            .ProjectTo<CategoryItemModel>(mapper.ConfigurationProvider)
            .ToListAsync();

        return Ok(items);
    }

    /// <summary>
    /// Створити нову категорію
    /// </summary>
    /// <param name="model">Модель створення категорії</param>
    /// <returns>Створена категорія</returns>
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CategoryCreateModel model)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var entity = mapper.Map<CategoryEntity>(model);

            if (model.Image != null)
            {
                var imageName = await imageService.SaveImageAsync(model.Image);
                entity.Image = imageName;
            }

            appDbContext.Categories.Add(entity);
            await appDbContext.SaveChangesAsync();

            var result = mapper.Map<CategoryItemModel>(entity);
            return CreatedAtAction(nameof(GetById), new { id = entity.Id }, result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Оновити категорію
    /// </summary>
    /// <param name="id">ID категорії</param>
    /// <param name="model">Модель оновлення категорії</param>
    /// <returns>Оновлена категорія</returns>
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromForm] CategoryUpdateModel model)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Встановлюємо ID з URL
            model.Id = id;

            var existing = await appDbContext.Categories
                .Where(x => !x.IsDeleted)
                .SingleOrDefaultAsync(x => x.Id == model.Id);

            if (existing == null)
                return NotFound(new { message = $"Категорію з ID {model.Id} не знайдено" });

            mapper.Map(model, existing);

            if (model.Image != null)
            {
                var imageNameDelete = existing.Image;
                if (!string.IsNullOrEmpty(imageNameDelete))
                {
                    await imageService.DeleteImageAsync(imageNameDelete);
                }

                var imageName = await imageService.SaveImageAsync(model.Image);
                existing.Image = imageName;
            }

            await appDbContext.SaveChangesAsync();

            var result = mapper.Map<CategoryItemModel>(existing);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Отримати категорію за ID
    /// </summary>
    /// <param name="id">ID категорії</param>
    /// <returns>Категорія</returns>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var entity = await appDbContext.Categories
            .Where(x => !x.IsDeleted)
            .ProjectTo<CategoryItemModel>(mapper.ConfigurationProvider)
            .SingleOrDefaultAsync(x => x.Id == id);

        if (entity == null)
        {
            return NotFound(new { message = $"Категорію з ID {id} не знайдено" });
        }

        return Ok(entity);
    }

    /// <summary>
    /// Видалити категорію (soft delete)
    /// </summary>
    /// <param name="id">ID категорії</param>
    /// <returns>Результат видалення</returns>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await appDbContext.Categories
            .Where(x => !x.IsDeleted)
            .SingleOrDefaultAsync(x => x.Id == id);

        if (entity == null)
        {
            return NotFound(new { message = $"Категорію з ID {id} не знайдено" });
        }

        entity.IsDeleted = true;
        await appDbContext.SaveChangesAsync();

        return NoContent();
    }
}