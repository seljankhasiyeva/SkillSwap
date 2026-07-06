using MediatR;
using SkillSwap.Application.Features.Submissions.DTOs;

namespace SkillSwap.Application.Features.Submissions.Queries;

public record GetMySubmissionsQuery(Guid LearnerId) : IRequest<List<SubmissionDto>>;