using CourseProjectMusic.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CourseProjectMusic.Interfaces
{
    public interface IMailService
    {
        Task<string> SendMail(MailClass mailClass);
        string GetMailBody(string url, string username);

    }
}
