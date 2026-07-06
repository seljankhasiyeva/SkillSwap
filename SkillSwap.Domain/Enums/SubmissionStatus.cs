using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SkillSwap.Domain.Enums
{
    public enum SubmissionStatus
    {
        Pending= 0,
        UnderReview= 1,
        Completed= 2,
        Failed= 3,
        RevisionRequested = 4,
        Approved = 5
    }
}
