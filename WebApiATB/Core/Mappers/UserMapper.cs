using AutoMapper;
using Core.Models.Seeder;
using Domain.Entities.Identity;

namespace Core.Mappers;

public class UserMapper : Profile
{
    public UserMapper()
    {
        CreateMap<SeederUserModel, UserEntity>()
            .ForMember(opt => opt.UserName, opt => opt.MapFrom(x => x.Email));
    }
}
