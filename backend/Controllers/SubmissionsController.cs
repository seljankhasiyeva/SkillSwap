using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkillSwap.Application.Features.Submissions.Commands;
using SkillSwap.Application.Features.Submissions.DTOs;
using SkillSwap.Application.Features.Submissions.Queries;
using System.Security.Claims;

namespace SkillSwap.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SubmissionsController : ControllerBase
{
    private readonly IMediator _mediator;

    public SubmissionsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [Authorize(Roles = "Learner")]
    public async Task<ActionResult<SubmissionDto>> Create(CreateSubmissionCommand command)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();

        var withLearner = command with { LearnerId = Guid.Parse(userIdClaim) };
        var result = await _mediator.Send(withLearner);
        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Mentor")]
    public async Task<ActionResult<bool>> Update(Guid id, UpdateSubmissionCommand command)
    {
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpGet("my")]
    [Authorize]
    public async Task<ActionResult<List<SubmissionDto>>> GetMy()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) return Unauthorized();

        var learnerId = Guid.Parse(userIdClaim);
        var query = new GetMySubmissionsQuery(learnerId);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet]
    [Authorize(Roles = "Mentor")]
    public async Task<ActionResult<List<SubmissionDto>>> GetAll()
    {
        var result = await _mediator.Send(new GetAllSubmissionsQuery());
        return Ok(result);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Mentor")]
    public async Task<ActionResult<SubmissionDto>> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetSubmissionByIdQuery(id));
        return Ok(result);
    }
}