using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SkillSwap.Domain.Enums;

namespace SkillSwap.Domain.Entities
{
    public class Submission
    {
        public Guid Id { get; set; }
        public Guid ChallengeId { get; set; }
        public Guid LearnerId { get; set; }
        public int? Score { get; set; }
        public string Feedback { get; set; } = string.Empty;
        public string? GithubUrl { get; set; }
        public string? Notes { get; set; }   
        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReviewedAt { get; set; }
        public Guid? ReviewedByUserId { get; set; }
        public SubmissionStatus Status { get; set; } = SubmissionStatus.Pending;

    }
}
