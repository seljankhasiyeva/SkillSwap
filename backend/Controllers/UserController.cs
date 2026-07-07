using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillSwap.Domain.Interfaces;
using System.Security.Claims;

namespace SkillSwap.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public UsersController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpGet("me")]
    public async Task<ActionResult> GetMe()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();

        var user = await _userRepository.GetByIdAsync(Guid.Parse(userIdClaim));
        if (user == null) return NotFound();

        return Ok(new
        {
            id = user.Id,
            fullName = user.FullName,
            email = user.Email,
            role = user.Role.ToString(),
            xpPoints = user.XpPoints,
            bio = user.Bio,
            skills = user.Skills,
            githubUrl = user.GithubUrl,
            organization = user.Organization,
            expertise = user.Expertise,
            companyName = user.CompanyName,
            experienceLevel = user.ExperienceLevel,
            careerGoal = user.CareerGoal
        });
    }

    [HttpPut("me")]
    public async Task<ActionResult> UpdateMe(UpdateProfileDto dto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();

        var user = await _userRepository.GetByIdAsync(Guid.Parse(userIdClaim));
        if (user == null) return NotFound();

        user.FullName = dto.FullName ?? user.FullName;
        user.Bio = dto.Bio;
        user.Skills = dto.Skills;
        user.GithubUrl = dto.GithubUrl;
        user.ExperienceLevel = dto.ExperienceLevel;
        user.CareerGoal = dto.CareerGoal;

        await _userRepository.UpdateAsync(user);

        return Ok(new
        {
            id = user.Id,
            fullName = user.FullName,
            email = user.Email,
            role = user.Role.ToString(),
            xpPoints = user.XpPoints,
            bio = user.Bio,
            skills = user.Skills,
            githubUrl = user.GithubUrl,
            organization = user.Organization,
            expertise = user.Expertise,
            companyName = user.CompanyName,
            experienceLevel = user.ExperienceLevel,
            careerGoal = user.CareerGoal
        });
    }
}

public class UpdateProfileDto
{
    public string? FullName { get; set; }
    public string? Bio { get; set; }
    public string? Skills { get; set; }
    public string? GithubUrl { get; set; }
    public string? ExperienceLevel { get; set; }
    public string? CareerGoal { get; set; }
}