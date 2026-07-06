using MediatR;
using SkillSwap.Application.Features.Submissions.Commands;
using SkillSwap.Application.Features.Submissions.DTOs;
using SkillSwap.Domain.Interfaces;
using SkillSwap.Domain.Enums;

namespace SkillSwap.Application.Features.Submissions.Commands
{
    public class CreateSubmissionCommandHandler : IRequestHandler<CreateSubmissionCommand, SubmissionDto>
    {
        private readonly ISubmissionRepository _submissionRepository;
        private readonly IChallengeRepository _challengeRepository;

        public CreateSubmissionCommandHandler(
            ISubmissionRepository submissionRepository,
            IChallengeRepository challengeRepository)
        {
            _submissionRepository = submissionRepository;
            _challengeRepository = challengeRepository;
        }

        public async Task<SubmissionDto> Handle(CreateSubmissionCommand request, CancellationToken cancellationToken)
        {
            var challenge = await _challengeRepository.GetByIdAsync(request.ChallengeId);
            if (challenge == null)
                throw new Exception("Challenge not found.");

            var submission = new Domain.Entities.Submission
            {
                Id = Guid.NewGuid(),
                ChallengeId = request.ChallengeId,
                LearnerId = request.LearnerId,
                GithubUrl = request.GithubUrl,
                Notes = request.Notes,
                Status = SubmissionStatus.Pending,
                Score = null,
                Feedback = string.Empty
            };
            await _submissionRepository.AddAsync(submission);

            return new SubmissionDto
            {
                Id = submission.Id,
                ChallengeId = submission.ChallengeId,
                LearnerId = submission.LearnerId,
                ChallengeTitle = challenge.Title,
                ChallengeCategory = challenge.Category,
                ChallengeDifficulty = challenge.Difficulty.ToString(),
                GithubUrl = submission.GithubUrl,
                Notes = submission.Notes,
                Status = SubmissionStatus.Pending.ToString(),
                Score = submission.Score,
                Feedback = submission.Feedback,
                SubmittedAt = submission.SubmittedAt
            };
        }
    }
}