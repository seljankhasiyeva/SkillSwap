using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SkillSwap.Domain.Enums;

namespace SkillSwap.Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public int? XpPoints { get; set; }
        public string? CompanyName { get; set; }
        public string? Bio { get; set; }
        public string? Skills { get; set; }
        public string? GithubUrl { get; set; }
        public string? LinkedInUrl { get; set; }
        public string? ExperienceLevel { get; set; }
        public string? CareerGoal { get; set; }
        public string? Organization { get; set; }
        public string? Expertise { get; set; }
        public string? CompanySize { get; set; }
        public string? Industry { get; set; }
        public string? HiringRoles { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
