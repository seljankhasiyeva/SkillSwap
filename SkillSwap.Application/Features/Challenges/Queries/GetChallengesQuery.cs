using MediatR;
using SkillSwap.Application.Features.Challenges.DTOs;

namespace SkillSwap.Application.Features.Challenges.Queries;

public record GetChallengesQuery(
    string? Category,
    string? Difficulty,
    string? PriceFilter,
    Guid? OwnerId = null
) : IRequest<List<ChallengeDto>>;