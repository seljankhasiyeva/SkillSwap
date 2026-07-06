using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SkillSwap.Domain.Enums;

namespace SkillSwap.Domain.Entities
{
    public class Challenge
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string? Description { get; set; }   
        public string Requirements { get; set; } = string.Empty;
        public string Deliverables { get; set; } = string.Empty;
        public string Technologies { get; set; } = string.Empty;
        public string Outcomes { get; set; } = string.Empty;
        public string Evaluation { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DifficultyLevel Difficulty { get; set; }
        public decimal Price { get; set; }  
        public int EstimatedTime { get; set; } 
        public int RewardPoints { get; set; }
        public int CompletedCount { get; set; }
        public bool IsCompanyChallenge { get; set; }
        public string? CompanyName { get; set; }
        public string? MentorName { get; set; }
        public string? MentorOrg { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public ChallengeStatus Status { get; set; } = ChallengeStatus.Draft;
        public Guid CreatedByUserId { get; set; }
    }
}
