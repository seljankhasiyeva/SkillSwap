using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SkillSwap.Domain.Entities;
using SkillSwap.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using SkillSwap.Domain.Enums;

namespace SkillSwap.Infrastructure.Persistence.Repositories
{
    public class SubmissionRepository: ISubmissionRepository
    {
        private readonly AppDbContext _context;
        public SubmissionRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Submission>> GetByLearnerIdAsync(Guid learnerId)
        {
            return await _context.Submissions.Where(s => s.LearnerId == learnerId).ToListAsync();
        }
        public async Task<IEnumerable<Submission>> GetPendingAsync()
        {
            return await _context.Submissions.Where(s => s.Status == SubmissionStatus.Pending).ToListAsync();
        }
        public async Task AddAsync(Submission submission)
        {
            await _context.Submissions.AddAsync(submission);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateAsync(Submission submission)
        {
            _context.Submissions.Update(submission);
            await _context.SaveChangesAsync();
        }
        public async Task<Submission?> GetByIdAsync(Guid id)
        {
            return await _context.Submissions.FindAsync(id);
        }

        public async Task<IEnumerable<Submission>> GetAllAsync()
        {
            return await _context.Submissions.ToListAsync();
        }
    }
}
