using MediatR;
using Microsoft.AspNetCore.Mvc;
using SkillSwap.Application.Features.Auth.Commands;
using SkillSwap.Application.Features.Auth.DTOs;

namespace SkillSwap.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
    {
        try
        {
            var command = new RegisterCommand(
                dto.FullName, dto.Email, dto.Password, dto.Role,
                dto.CompanyName, dto.Bio, dto.Skills, dto.GithubUrl,
                dto.Organization, dto.Expertise, dto.CompanySize,
                dto.Industry, dto.HiringRoles);

            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        try
        {
            var command = new LoginCommand(dto.Email, dto.Password);
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}