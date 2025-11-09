using Core.Models.Category;

namespace Core.Interfaces;

public interface ICategoryService
{
    Task<List<CategoryItemModel>> GetAllAsync();
    Task<CategoryItemModel?> GetByIdAsync(int id);
    Task<CategoryItemModel> CreateAsync(CategoryCreateModel model);
    Task<CategoryItemModel> UpdateAsync(CategoryUpdateModel model);
    Task DeleteAsync(int id);
}