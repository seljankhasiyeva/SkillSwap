using MediatR;
using SkillSwap.Domain.Interfaces;
using SkillSwap.Domain.Enums;

namespace SkillSwap.Application.Features.Submissions.Commands;

public class UpdateSubmissionCommandHandler : IRequestHandler<UpdateSubmissionCommand, bool>
{
    private readonly ISubmissionRepository _submissionRepository;

    public UpdateSubmissionCommandHandler(ISubmissionRepository submissionRepository)
    {
        _submissionRepository = submissionRepository;
    }

    public async Task<bool> Handle(UpdateSubmissionCommand request, CancellationToken cancellationToken)
    {
        var submission = await _submissionRepository.GetByIdAsync(request.SubmissionId);
        if (submission == null)
            return false;

        submission.Status = Enum.Parse<SubmissionStatus>(request.Status, true);
        submission.Score = request.Score;
        submission.Feedback = request.Feedback;
        submission.ReviewedAt = DateTime.UtcNow;

        await _submissionRepository.UpdateAsync(submission);
        return true;
    }
}