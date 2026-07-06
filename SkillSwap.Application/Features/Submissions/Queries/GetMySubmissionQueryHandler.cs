using MediatR;
using SkillSwap.Application.Features.Submissions.DTOs;
using SkillSwap.Domain.Interfaces;

namespace SkillSwap.Application.Features.Submissions.Queries;

public class GetMySubmissionsQueryHandler : IRequestHandler<GetMySubmissionsQuery, List<SubmissionDto>>
{
    private readonly ISubmissionRepository _submissionRepository;
    private readonly IChallengeRepository _challengeRepository;

    public GetMySubmissionsQueryHandler(
        ISubmissionRepository submissionRepository,
        IChallengeRepository challengeRepository)
    {
        _submissionRepository = submissionRepository;
        _challengeRepository = challengeRepository;
    }

    public async Task<List<SubmissionDto>> Handle(GetMySubmissionsQuery request, CancellationToken cancellationToken)
    {
        var submissions = await _submissionRepository.GetByLearnerIdAsync(request.LearnerId);
        var challenges = (await _challengeRepository.GetAllAsync()).ToDictionary(c => c.Id);

        return submissions.Select(s =>
        {
            challenges.TryGetValue(s.ChallengeId, out var challenge);
            return new SubmissionDto
            {
                Id = s.Id,
                ChallengeId = s.ChallengeId,
                LearnerId = s.LearnerId,
                ChallengeTitle = challenge?.Title ?? string.Empty,
                ChallengeCategory = challenge?.Category ?? string.Empty,
                ChallengeDifficulty = challenge?.Difficulty.ToString() ?? string.Empty,
                Status = s.Status.ToString(),
                Score = s.Score,
                Feedback = s.Feedback,
                GithubUrl = s.GithubUrl,
                Notes = s.Notes,
                SubmittedAt = s.SubmittedAt
            };
        }).ToList();
    }
}