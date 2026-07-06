using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using SkillSwap.Application.Common.Interfaces;
using SkillSwap.Application.Features.Auth.DTOs;
using SkillSwap.Domain.Entities;
using SkillSwap.Domain.Enums;
using SkillSwap.Domain.Interfaces;

namespace SkillSwap.Application.Features.Auth.Commands
{
    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponseDto>
    {
        private readonly IUserRepository _userRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtService _jwtService;
        public RegisterCommandHandler(IUserRepository userRepository, IPasswordHasher passwordHasher, IJwtService jwtService)
        {
             _userRepository = userRepository;
            _passwordHasher = passwordHasher;
            _jwtService = jwtService;
        }
        public async Task<AuthResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            // Check if the user already exists
            var existingUser = await _userRepository.GetByEmailAsync(request.Email);
            if (existingUser != null)
            {
                throw new Exception("User with this email already exists.");
            }
            // Hash the password
            var hashedPassword = _passwordHasher.HashPassword(request.Password);
            // Create a new user entity
            var user = new User
            {
                Id = Guid.NewGuid(),
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = hashedPassword,
                Role = Enum.Parse<UserRole>(request.Role, true),
                CompanyName = request.CompanyName,
                Bio = request.Bio,
                Skills = request.Skills,
                GithubUrl = request.GithubUrl,
                Organization = request.Organization,
                Expertise = request.Expertise,
                CompanySize = request.CompanySize,
                Industry = request.Industry,
                HiringRoles = request.HiringRoles
            };
            // Save the user to the database
            await _userRepository.AddAsync(user);
            // Generate JWT token
            var token = _jwtService.GenerateToken(user);
            return new AuthResponseDto
            {
                Token = token,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role.ToString()
            };
        }
    }
}
