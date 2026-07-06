using SkillSwap.Domain.Entities;

namespace SkillSwap.Domain.Interfaces
{
    public interface ISubmissionRepository
    {
        Task<IEnumerable<Submission>> GetAllAsync();
        Task<IEnumerable<Submission>> GetByLearnerIdAsync(Guid learnerId);
        Task<IEnumerable<Submission>> GetPendingAsync();
        Task AddAsync(Submission submission);
        Task UpdateAsync(Submission submission);
        Task<Submission?> GetByIdAsync(Guid id);
    }
}