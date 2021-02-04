using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CourseProjectMusic.Models
{
    public class MailClass
    {
        public string FromMail { get; set; } = "dyrdadmitrij99@gmail.com";
        public string FromMailPassword { get; set; } = "walking78351";
        public List<string> ToMails { get; set; } = new List<string>();
        public string Subject { get; set; } = "";
        public string Body { get; set; } = "";
        public bool IsBodyHtml { get; set; } = true;
    }
}
