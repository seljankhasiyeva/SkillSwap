using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using SkillSwap.Application.Features.Auth.DTOs;

namespace SkillSwap.Application.Features.Auth.Commands
{
    public record RegisterCommand
    (
        string FullName,
        string Email,
        string Password,
        string Role,
        string? CompanyName,
        string? Bio,
        string? Skills,
        string? GithubUrl,
        string? Organization,
        string? Expertise,
        string? CompanySize,
        string? Industry,
        string? HiringRoles
    ) : IRequest<AuthResponseDto>;
}
