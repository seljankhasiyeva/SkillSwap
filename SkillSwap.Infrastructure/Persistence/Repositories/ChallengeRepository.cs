using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SkillSwap.Domain.Entities;
using SkillSwap.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SkillSwap.Infrastructure.Persistence.Repositories
{
    public class ChallengeRepository: IChallengeRepository
    {
        private readonly AppDbContext _context;
        public ChallengeRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Challenge>> GetAllAsync()
        {
            return await _context.Challenges.ToListAsync();
        }
        public async Task<Challenge?> GetByIdAsync(Guid id)
        {
            return await _context.Challenges.FindAsync(id);
        }
        public async Task AddAsync(Challenge challenge)
        {
            await _context.Challenges.AddAsync(challenge);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(Challenge challenge)
        {
            _context.Challenges.Update(challenge);
            await _context.SaveChangesAsync();
        }
    }
}
