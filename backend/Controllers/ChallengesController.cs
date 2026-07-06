using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillSwap.Application.Features.Challenges.Commands;
using SkillSwap.Application.Features.Challenges.DTOs;
using SkillSwap.Application.Features.Challenges.Queries;
using System.Security.Claims;

namespace SkillSwap.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChallengesController : ControllerBase
{
    private readonly IMediator _mediator;

    public ChallengesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<ActionResult<List<ChallengeDto>>> GetAll(
        [FromQuery] string? category,
        [FromQuery] string? difficulty,
        [FromQuery] string? priceFilter,
        [FromQuery] bool mine = false)
    {
        Guid? ownerId = null;
        if (mine)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null) return Unauthorized();
            ownerId = Guid.Parse(userIdClaim);
        }

        var query = new GetChallengesQuery(category, difficulty, priceFilter, ownerId);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ChallengeDto>> GetById(Guid id)
    {
        var query = new GetChallengeByIdQuery(id);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "Mentor,Company")]
    public async Task<ActionResult<ChallengeDto>> Create(CreateChallengeCommand command)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();

        var withOwner = command with { CreatedByUserId = Guid.Parse(userIdClaim) };
        var result = await _mediator.Send(withOwner);
        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Mentor,Company")]
    public async Task<ActionResult<ChallengeDto>> Update(Guid id, UpdateChallengeCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }
}