using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CourseProjectMusic.Interfaces
{
    public interface ICloud
    {
        Task<bool> IfFileExists(string parent, string fileName);
        Task<string> AddFile(string parent, string fileName, Stream stream);
        Task DeleteFile(string parent, string fileName);
        Task<string> EditFile(string oldParent, string oldFileName, string newParent, string newFileName, Stream stream);
    }
}
