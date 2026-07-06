using MediatR;
using SkillSwap.Application.Features.Submissions.DTOs;
using SkillSwap.Domain.Interfaces;

namespace SkillSwap.Application.Features.Submissions.Queries;

public class GetAllSubmissionsQueryHandler : IRequestHandler<GetAllSubmissionsQuery, List<SubmissionDto>>
{
    private readonly ISubmissionRepository _submissionRepository;
    private readonly IChallengeRepository _challengeRepository;
    private readonly IUserRepository _userRepository;

    public GetAllSubmissionsQueryHandler(
        ISubmissionRepository submissionRepository,
        IChallengeRepository challengeRepository,
        IUserRepository userRepository)
    {
        _submissionRepository = submissionRepository;
        _challengeRepository = challengeRepository;
        _userRepository = userRepository;
    }

    public async Task<List<SubmissionDto>> Handle(GetAllSubmissionsQuery request, CancellationToken cancellationToken)
    {
        var submissions = (await _submissionRepository.GetAllAsync())
            .OrderByDescending(s => s.SubmittedAt)
            .ToList();
        var challenges = (await _challengeRepository.GetAllAsync()).ToDictionary(c => c.Id);

        var result = new List<SubmissionDto>();
        foreach (var s in submissions)
        {
            challenges.TryGetValue(s.ChallengeId, out var challenge);
            var learner = await _userRepository.GetByIdAsync(s.LearnerId);

            result.Add(new SubmissionDto
            {
                Id = s.Id,
                ChallengeId = s.ChallengeId,
                LearnerId = s.LearnerId,
                ChallengeTitle = challenge?.Title ?? string.Empty,
                ChallengeCategory = challenge?.Category ?? string.Empty,
                ChallengeDifficulty = challenge?.Difficulty.ToString() ?? string.Empty,
                LearnerName = learner?.FullName ?? string.Empty,
                LearnerEmail = learner?.Email ?? string.Empty,
                Status = s.Status.ToString(),
                Score = s.Score,
                Feedback = s.Feedback,
                GithubUrl = s.GithubUrl,
                Notes = s.Notes,
                SubmittedAt = s.SubmittedAt
            });
        }
        return result;
    }
}