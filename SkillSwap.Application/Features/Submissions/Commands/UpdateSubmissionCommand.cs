using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using SkillSwap.Domain.Entities;

namespace SkillSwap.Application.Features.Submissions.Commands
{
    public record UpdateSubmissionCommand
    (
        Guid SubmissionId,
        string Status,
        int Score,
        string Feedback
    ) : IRequest<bool>;
}
