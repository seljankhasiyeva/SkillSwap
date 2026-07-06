using MediatR;
using SkillSwap.Application.Features.Submissions.DTOs;

namespace SkillSwap.Application.Features.Submissions.Queries;

public record GetAllSubmissionsQuery() : IRequest<List<SubmissionDto>>;