using AutoMapper;
using Core.Constants;
using Core.Interfaces;
using Core.Models.Seeder;
using Domain;
using Domain.Entities;
using Domain.Entities.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace WebApiATB;

public static class DbSeedData
{
    public static async Task SeedData(this WebApplication webApplication)
    {
        using var scoped = webApplication.Services.CreateScope();
        var context = scoped.ServiceProvider.GetRequiredService<AppDbContext>();
        var roleManager = scoped.ServiceProvider.GetRequiredService<RoleManager<RoleEntity>>();
        var userManager = scoped.ServiceProvider.GetRequiredService<UserManager<UserEntity>>();
        var mapper = scoped.ServiceProvider.GetRequiredService<IMapper>();

        try
        {
            // Застосувати міграції
            await context.Database.MigrateAsync();
            Console.WriteLine("✅ Database migrations applied");

            // ВАЖЛИВО: Спочатку створюємо ролі!
            if (!await context.Roles.AnyAsync())
            {
                Console.WriteLine("📋 Seeding roles...");
                foreach (var roleName in Roles.AllRoles)
                {
                    var result = await roleManager.CreateAsync(new RoleEntity { Name = roleName });
                    if (result.Succeeded)
                    {
                        Console.WriteLine($"✅ Role '{roleName}' created");
                    }
                    else
                    {
                        Console.WriteLine($"❌ Error creating role '{roleName}': {string.Join(", ", result.Errors.Select(e => e.Description))}");
                    }
                }
            }
            else
            {
                Console.WriteLine("ℹ️  Roles already exist");
            }

            // Seed Categories
            if (!await context.Categories.AnyAsync())
            {
                Console.WriteLine("📋 Seeding categories...");
                var jsonFile = Path.Combine(Directory.GetCurrentDirectory(), "Helpers", "JsonData", "Categories.json");
                if (File.Exists(jsonFile))
                {
                    var jsonData = await File.ReadAllTextAsync(jsonFile);
                    try
                    {
                        var categories = JsonSerializer.Deserialize<List<SeederCategoryModel>>(jsonData);
                        if (categories != null && categories.Any())
                        {
                            var entities = categories.Select(x =>
                                new CategoryEntity
                                {
                                    Image = x.Image,
                                    Name = x.Name,
                                });

                            await context.Categories.AddRangeAsync(entities);
                            await context.SaveChangesAsync();
                            Console.WriteLine($"✅ {categories.Count} categories created");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"❌ Error parsing Categories.json: {ex.Message}");
                    }
                }
                else
                {
                    Console.WriteLine($"⚠️  Categories.json not found at: {jsonFile}");
                }
            }
            else
            {
                Console.WriteLine("ℹ️  Categories already exist");
            }

            // Seed Users (тільки після створення ролей!)
            if (!await context.Users.AnyAsync())
            {
                Console.WriteLine("📋 Seeding users...");
                var imageService = scoped.ServiceProvider.GetRequiredService<IImageService>();
                var jsonFile = Path.Combine(Directory.GetCurrentDirectory(), "Helpers", "JsonData", "Users.json");

                if (File.Exists(jsonFile))
                {
                    var jsonData = await File.ReadAllTextAsync(jsonFile);
                    try
                    {
                        var users = JsonSerializer.Deserialize<List<SeederUserModel>>(jsonData);
                        if (users != null && users.Any())
                        {
                            foreach (var user in users)
                            {
                                var entity = mapper.Map<UserEntity>(user);
                                entity.UserName = user.Email;

                                try
                                {
                                    entity.Image = await imageService.SaveImageFromUrlAsync(user.Image);
                                }
                                catch (Exception ex)
                                {
                                    Console.WriteLine($"⚠️  Error downloading image for {user.Email}: {ex.Message}");
                                    entity.Image = "default.jpg";
                                }

                                var result = await userManager.CreateAsync(entity, user.Password);
                                if (!result.Succeeded)
                                {
                                    Console.WriteLine($"❌ Error creating user {user.Email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                                    continue;
                                }

                                Console.WriteLine($"✅ User '{user.Email}' created");

                                // Додаємо ролі
                                foreach (var role in user.Roles)
                                {
                                    if (await roleManager.RoleExistsAsync(role))
                                    {
                                        var roleResult = await userManager.AddToRoleAsync(entity, role);
                                        if (roleResult.Succeeded)
                                        {
                                            Console.WriteLine($"  ✅ Added role '{role}' to {user.Email}");
                                        }
                                        else
                                        {
                                            Console.WriteLine($"  ❌ Error adding role '{role}': {string.Join(", ", roleResult.Errors.Select(e => e.Description))}");
                                        }
                                    }
                                    else
                                    {
                                        Console.WriteLine($"  ⚠️  Role '{role}' does not exist");
                                    }
                                }
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"❌ Error parsing Users.json: {ex.Message}");
                    }
                }
                else
                {
                    Console.WriteLine($"⚠️  Users.json not found at: {jsonFile}");
                }
            }
            else
            {
                Console.WriteLine("ℹ️  Users already exist");
            }

            Console.WriteLine("🎉 Database seeding completed!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Critical error during seeding: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
        }
    }
}