using MediatR;
using SkillSwap.Application.Features.Challenges.DTOs;
using SkillSwap.Domain.Interfaces;

namespace SkillSwap.Application.Features.Challenges.Queries;

public class GetChallengesQueryHandler : IRequestHandler<GetChallengesQuery, List<ChallengeDto>>
{
    private readonly IChallengeRepository _challengeRepository;

    public GetChallengesQueryHandler(IChallengeRepository challengeRepository)
    {
        _challengeRepository = challengeRepository;
    }

    public async Task<List<ChallengeDto>> Handle(GetChallengesQuery request, CancellationToken cancellationToken)
    {
        var challenges = await _challengeRepository.GetAllAsync();

        return challenges
            .Where(c => request.Category == null || c.Category == request.Category)
            .Where(c => request.Difficulty == null || c.Difficulty.ToString() == request.Difficulty)
            .Where(c => request.PriceFilter == null ||
                        (request.PriceFilter == "Free" && c.Price == 0) ||
                        (request.PriceFilter == "Paid" && c.Price > 0))
            .Where(c => request.OwnerId == null || c.CreatedByUserId == request.OwnerId)
            .Select(c => new ChallengeDto
            {
                Id = c.Id,
                Title = c.Title,
                Summary = c.Summary,
                Description = c.Description,
                Requirements = c.Requirements,
                Deliverables = c.Deliverables,
                Technologies = c.Technologies,
                Outcomes = c.Outcomes,
                Evaluation = c.Evaluation,
                Category = c.Category,
                Difficulty = c.Difficulty.ToString(),
                Price = c.Price,
                EstimatedTime = c.EstimatedTime,
                RewardPoints = c.RewardPoints,
                CompletedCount = c.CompletedCount,
                IsCompanyChallenge = c.IsCompanyChallenge,
                CompanyName = c.CompanyName,
                MentorName = c.MentorName,
                MentorOrg = c.MentorOrg,
                Status = c.Status.ToString(),
                CreatedByUserId = c.CreatedByUserId
            })
            .ToList();
    }
}