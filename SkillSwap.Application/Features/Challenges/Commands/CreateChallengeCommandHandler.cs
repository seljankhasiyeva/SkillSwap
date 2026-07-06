using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using SkillSwap.Application.Features.Challenges.DTOs;
using SkillSwap.Domain.Interfaces;
using SkillSwap.Domain.Entities;
using SkillSwap.Domain.Enums;



namespace SkillSwap.Application.Features.Challenges.Commands
{
    public class CreateChallengeCommandHandler : IRequestHandler<CreateChallengeCommand, ChallengeDto>
    {
        private readonly IChallengeRepository _challengeRepository;
        public CreateChallengeCommandHandler(IChallengeRepository challengeRepository)
        {
            _challengeRepository = challengeRepository;
        }
        public async Task<ChallengeDto> Handle(CreateChallengeCommand request, CancellationToken cancellationToken)
        {
            var challenge = new Challenge
            {
                Id = Guid.NewGuid(),
                Title = request.Title,
                Summary = request.Summary,
                Description = request.Description,
                Requirements = request.Requirements ?? string.Empty,
                Deliverables = request.Deliverables ?? string.Empty,
                Technologies = request.Technologies ?? string.Empty,
                Outcomes = request.Outcomes ?? string.Empty,
                Evaluation = request.Evaluation ?? string.Empty,
                Category = request.Category,
                Difficulty = Enum.Parse<DifficultyLevel>(request.Difficulty, true),
                Price = request.Price,
                EstimatedTime = request.EstimatedTime,
                RewardPoints = request.RewardPoints,
                CompletedCount = 0,
                IsCompanyChallenge = request.IsCompanyChallenge,
                CompanyName = request.CompanyName,
                MentorName = request.MentorName,
                MentorOrg = request.MentorOrg,
                Status = Enum.Parse<ChallengeStatus>(request.Status, true),
                CreatedByUserId = request.CreatedByUserId
            };
            await _challengeRepository.AddAsync(challenge);
            return MapToDto(challenge);
        }

        private static ChallengeDto MapToDto(Challenge challenge) => new ChallengeDto
        {
            Id = challenge.Id,
            Title = challenge.Title,
            Summary = challenge.Summary,
            Description = challenge.Description,
            Requirements = challenge.Requirements,
            Deliverables = challenge.Deliverables,
            Technologies = challenge.Technologies,
            Outcomes = challenge.Outcomes,
            Evaluation = challenge.Evaluation,
            Category = challenge.Category,
            Difficulty = challenge.Difficulty.ToString(),
            Price = challenge.Price,
            EstimatedTime = challenge.EstimatedTime,
            RewardPoints = challenge.RewardPoints,
            CompletedCount = challenge.CompletedCount,
            IsCompanyChallenge = challenge.IsCompanyChallenge,
            CompanyName = challenge.CompanyName,
            MentorName = challenge.MentorName,
            MentorOrg = challenge.MentorOrg,
            Status = challenge.Status.ToString(),
            CreatedByUserId = challenge.CreatedByUserId
        };
    }
}
