using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SkillSwap.Domain.Entities;

namespace SkillSwap.Domain.Interfaces
{
    public interface IChallengeRepository
    {
        Task<IEnumerable<Challenge>> GetAllAsync();
        Task<Challenge?> GetByIdAsync(Guid id);
        Task AddAsync(Challenge challenge);
        Task UpdateAsync(Challenge challenge);
    }
}
