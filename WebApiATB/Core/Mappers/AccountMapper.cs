using AutoMapper;
using Core.Models.Account;
using Core.Models.Seeder;
using Domain.Entities.Identity;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Core.Mappers;

public class AccountMapper : Profile
{
    public AccountMapper()
    {
        CreateMap<RegisterModel, UserEntity>()
            .ForMember(opt => opt.Image, opt => opt.Ignore())
            .ForMember(opt => opt.UserName, opt => opt.MapFrom(x => x.Email));
    }

}
