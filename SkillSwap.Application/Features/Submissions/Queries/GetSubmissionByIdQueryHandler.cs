using MediatR;
using SkillSwap.Application.Features.Submissions.DTOs;
using SkillSwap.Domain.Interfaces;

namespace SkillSwap.Application.Features.Submissions.Queries;

public class GetSubmissionByIdQueryHandler : IRequestHandler<GetSubmissionByIdQuery, SubmissionDto>
{
    private readonly ISubmissionRepository _submissionRepository;
    private readonly IChallengeRepository _challengeRepository;
    private readonly IUserRepository _userRepository;

    public GetSubmissionByIdQueryHandler(
        ISubmissionRepository submissionRepository,
        IChallengeRepository challengeRepository,
        IUserRepository userRepository)
    {
        _submissionRepository = submissionRepository;
        _challengeRepository = challengeRepository;
        _userRepository = userRepository;
    }

    public async Task<SubmissionDto> Handle(GetSubmissionByIdQuery request, CancellationToken cancellationToken)
    {
        var s = await _submissionRepository.GetByIdAsync(request.SubmissionId);
        if (s == null) throw new Exception("Submission not found.");

        var challenge = await _challengeRepository.GetByIdAsync(s.ChallengeId);
        var learner = await _userRepository.GetByIdAsync(s.LearnerId);

        return new SubmissionDto
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
        };
    }
}