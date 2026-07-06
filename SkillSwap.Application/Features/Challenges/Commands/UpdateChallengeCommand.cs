using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using SkillSwap.Application.Features.Challenges.DTOs;

namespace SkillSwap.Application.Features.Challenges.Commands
{
    public record UpdateChallengeCommand
(
    Guid Id,
    string Title,
    string Summary,
    string Category,
    string Difficulty,
    decimal Price,
    int EstimatedTime,
    int RewardPoints,
    bool IsCompanyChallenge,
    string CompanyName,
    string MentorName,
    string MentorOrg,
    string Status,
    string? Description = null,
    string? Requirements = null,
    string? Deliverables = null,
    string? Technologies = null,
    string? Outcomes = null,
    string? Evaluation = null
) : IRequest<ChallengeDto>;
}
