using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkillSwap.Application.Features.Submissions.DTOs
{
    public class SubmissionDto
    {
        public Guid Id { get; set; }
        public Guid ChallengeId { get; set; }
        public Guid LearnerId { get; set; }
        public string ChallengeTitle { get; set; } = string.Empty;
        public string ChallengeCategory { get; set; } = string.Empty;
        public string ChallengeDifficulty { get; set; } = string.Empty;
        public string LearnerName { get; set; } = string.Empty;
        public string LearnerEmail { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int? Score { get; set; }
        public string? Feedback { get; set; }
        public string? GithubUrl { get; set; }
        public string? Notes { get; set; }
        public DateTime SubmittedAt { get; set; }
    }
}
