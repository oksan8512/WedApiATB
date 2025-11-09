using AutoMapper;
using Core.Interfaces;
using Core.Models.Category;
using Domain;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Core.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly IImageService _imageService;

    public CategoryService(AppDbContext context, IMapper mapper, IImageService imageService)
    {
        _context = context;
        _mapper = mapper;
        _imageService = imageService;
    }

    public async Task<List<CategoryItemModel>> GetAllAsync()
    {
        var categories = await _context.Categories
            .AsNoTracking()
            .ToListAsync();

        return _mapper.Map<List<CategoryItemModel>>(categories);
    }

    public async Task<CategoryItemModel?> GetByIdAsync(int id)
    {
        var category = await _context.Categories
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

        return category == null ? null : _mapper.Map<CategoryItemModel>(category);
    }

    public async Task<CategoryItemModel> CreateAsync(CategoryCreateModel model)
    {
        var category = _mapper.Map<CategoryEntity>(model);

        // Обробка завантаження зображення
        if (model.Image != null)
        {
            category.Image = await _imageService.SaveImageAsync(model.Image);
        }

        await _context.Categories.AddAsync(category);
        await _context.SaveChangesAsync();

        return _mapper.Map<CategoryItemModel>(category);
    }

    public async Task<CategoryItemModel> UpdateAsync(CategoryUpdateModel model)
    {
        var category = await _context.Categories.FindAsync(model.Id);

        if (category == null)
        {
            throw new Exception($"Категорію з ID {model.Id} не знайдено");
        }

        // Зберігаємо стару назву зображення для видалення
        var oldImage = category.Image;

        // Оновлюємо поля
        _mapper.Map(model, category);

        // Якщо є нове зображення
        if (model.Image != null)
        {
            // Видаляємо старе зображення
            if (!string.IsNullOrEmpty(oldImage))
            {
                await _imageService.DeleteImageAsync(oldImage);
            }

            // Зберігаємо нове
            category.Image = await _imageService.SaveImageAsync(model.Image);
        }

        _context.Categories.Update(category);
        await _context.SaveChangesAsync();

        return _mapper.Map<CategoryItemModel>(category);
    }

    public async Task DeleteAsync(int id)
    {
        var category = await _context.Categories.FindAsync(id);

        if (category == null)
        {
            throw new Exception($"Категорію з ID {id} не знайдено");
        }

        // Видаляємо зображення
        if (!string.IsNullOrEmpty(category.Image))
        {
            await _imageService.DeleteImageAsync(category.Image);
        }

        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
    }
}