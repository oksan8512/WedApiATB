using Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace Core.Services;


public class ImageService(IConfiguration configuration) : IImageService
{
    // Видаляє зображення 
    public async Task DeleteImageAsync(string name)
    {
        // Отримує розмір зображення
        var sizes = configuration.GetRequiredSection("ImageSizes").Get<List<int>>();
        var dir = Path.Combine(Directory.GetCurrentDirectory(), configuration["ImagesDir"]!);

        // Створює паралельні задачі для видалення кожного файлу
        Task[] tasks = sizes
            .AsParallel()
            .Select(size =>
            {
                return Task.Run(() =>
                {
                    var path = Path.Combine(dir, $"{size}_{name}");
                    if (File.Exists(path))
                    {
                        File.Delete(path);
                    }
                });
            })
            .ToArray();

        await Task.WhenAll(tasks);
    }

    // Завантажує зображення з URL і зберігає його
    public async Task<string> SaveImageFromUrlAsync(string imageUrl)
    {
        using var httpClient = new HttpClient();
        var imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
        return await SaveImageAsync(imageBytes);
    }

    // Зберігає зображення, отримане з форми (IFormFile)
    public async Task<string> SaveImageAsync(IFormFile file)
    {
        using MemoryStream ms = new();
        await file.CopyToAsync(ms);
        var bytes = ms.ToArray();

        var imageName = await SaveImageAsync(bytes);
        return imageName;
    }

    // зберігає зображення у кількох розмірах
    private async Task<string> SaveImageAsync(byte[] bytes)
    {
        // Генерує випадкове ім’я файлу з розширенням .webp
        string imageName = $"{Path.GetRandomFileName()}.webp";
        var sizes = configuration.GetRequiredSection("ImageSizes").Get<List<int>>();

        // Створює паралельні задачі для збереження зображення в кожному розмірі
        Task[] tasks = sizes
            .AsParallel()
            .Select(s => SaveImageAsync(bytes, imageName, s))
            .ToArray();

        await Task.WhenAll(tasks);

        return imageName;
    }

    // Зберігає зображення, передане у форматі base64
    public async Task<string> SaveImageFromBase64Async(string input)
    {
        // Витягує чисті base64-дані (без префіксу типу)
        var base64Data = input.Contains(",")
           ? input.Substring(input.IndexOf(",") + 1)
           : input;

        byte[] imageBytes = Convert.FromBase64String(base64Data);

        return await SaveImageAsync(imageBytes);
    }

    // змінює розмір зображення і зберігає його
    private async Task SaveImageAsync(byte[] bytes, string name, int size)
    {
        var path = Path.Combine(Directory.GetCurrentDirectory(), configuration["ImagesDir"]!,
            $"{size}_{name}");

        // Завантажує зображення з байтів
        using var image = Image.Load(bytes);

        // Змінює розмір зображення (режим Max — зберігає пропорції)
        image.Mutate(imgContext =>
        {
            imgContext.Resize(new ResizeOptions
            {
                Size = new Size(size, size),
                Mode = ResizeMode.Max
            });
        });

        // Зберігає зображення у форматі WebP
        await image.SaveAsync(path, new WebpEncoder());
    }
}
