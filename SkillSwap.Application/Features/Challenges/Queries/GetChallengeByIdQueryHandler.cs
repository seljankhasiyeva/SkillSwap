using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using SkillSwap.Application.Features.Challenges.DTOs;
using SkillSwap.Application.Features.Challenges.Queries;
using SkillSwap.Application.Common.Interfaces;
using SkillSwap.Domain.Entities;
using SkillSwap.Domain.Interfaces;

namespace SkillSwap.Application.Features.Challenges.Queries
{
    public class GetChallengeByIdQueryHandler: IRequestHandler<GetChallengeByIdQuery, ChallengeDto>
    {
        private readonly IChallengeRepository _challengeRepository;

        public GetChallengeByIdQueryHandler(IChallengeRepository challengeRepository)
        {
            _challengeRepository = challengeRepository;
        }

        public async Task<ChallengeDto> Handle(GetChallengeByIdQuery request, CancellationToken cancellationToken)
        {
            var challenge = await _challengeRepository.GetByIdAsync(request.ChallengeId);
            if (challenge == null)
                throw new Exception("Challenge not found.");

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
