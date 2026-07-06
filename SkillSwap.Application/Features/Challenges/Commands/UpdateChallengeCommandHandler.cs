using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using SkillSwap.Application.Features.Challenges.DTOs;
using SkillSwap.Domain.Entities;
using SkillSwap.Domain.Enums;
using SkillSwap.Domain.Interfaces;

namespace SkillSwap.Application.Features.Challenges.Commands
{
    public class UpdateChallengeCommandHandler : IRequestHandler<UpdateChallengeCommand, ChallengeDto>
    {
        private readonly IChallengeRepository _challengeRepository;
        public UpdateChallengeCommandHandler(IChallengeRepository challengeRepository)
        {
            _challengeRepository = challengeRepository;
        }
        public async Task<ChallengeDto> Handle(UpdateChallengeCommand request, CancellationToken cancellationToken)
        {
            var challenge = await _challengeRepository.GetByIdAsync(request.Id);
            if (challenge == null)
                throw new Exception("Challenge not found.");

            challenge.Title = request.Title;
            challenge.Summary = request.Summary;
            challenge.Description = request.Description ?? challenge.Description;
            challenge.Requirements = request.Requirements ?? challenge.Requirements;
            challenge.Deliverables = request.Deliverables ?? challenge.Deliverables;
            challenge.Technologies = request.Technologies ?? challenge.Technologies;
            challenge.Outcomes = request.Outcomes ?? challenge.Outcomes;
            challenge.Evaluation = request.Evaluation ?? challenge.Evaluation;
            challenge.Category = request.Category;
            challenge.Difficulty = Enum.Parse<DifficultyLevel>(request.Difficulty, true);
            challenge.Price = request.Price;
            challenge.EstimatedTime = request.EstimatedTime;
            challenge.RewardPoints = request.RewardPoints;
            challenge.IsCompanyChallenge = request.IsCompanyChallenge;
            challenge.CompanyName = request.CompanyName;
            challenge.MentorName = request.MentorName;
            challenge.MentorOrg = request.MentorOrg;
            challenge.Status = Enum.Parse<ChallengeStatus>(request.Status, true);

            await _challengeRepository.UpdateAsync(challenge);
            return new ChallengeDto
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
}
