using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkillSwap.Application.Features.Auth.DTOs
{
    public class RegisterDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? CompanyName { get; set; }
        public string? Bio { get; set; }
        public string? Skills { get; set; }
        public string? GithubUrl { get; set; }
        public string? Organization { get; set; }
        public string? Expertise { get; set; }
        public string? CompanySize { get; set; }
        public string? Industry { get; set; }
        public string? HiringRoles { get; set; }
    }
}
