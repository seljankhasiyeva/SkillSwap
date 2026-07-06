using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using SkillSwap.Application.Features.Submissions.DTOs;
using SkillSwap.Domain.Entities;

namespace SkillSwap.Application.Features.Submissions.Commands
{
    public record CreateSubmissionCommand
    (
        Guid ChallengeId,
        Guid LearnerId,
        string GithubUrl,
        string? Notes = null
    ) : IRequest<SubmissionDto>;
}