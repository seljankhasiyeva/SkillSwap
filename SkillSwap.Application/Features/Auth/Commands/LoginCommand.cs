using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using SkillSwap.Application.Features.Auth.DTOs;

namespace SkillSwap.Application.Features.Auth.Commands
{
    public record LoginCommand(
        string Email,
        string Password
    ) : IRequest<AuthResponseDto>;
}
