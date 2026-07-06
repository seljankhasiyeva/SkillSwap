using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SkillSwap.Application.Features.Challenges.DTOs;
using MediatR;

namespace SkillSwap.Application.Features.Challenges.Queries
{
    public record GetChallengeByIdQuery
    (
        Guid ChallengeId
    ) : IRequest<ChallengeDto>;
}
