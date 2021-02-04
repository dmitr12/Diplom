using CourseProjectMusic.Interfaces;
using CourseProjectMusic.Models;
using CourseProjectMusic.Utils;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace CourseProjectMusic.DI
{
    public class MailService : IMailService
    {
        public async Task<string> SendMail(MailClass mailClass)
        {
            try
            {
                using(MailMessage mail=new MailMessage())
                {
                    mail.From = new MailAddress(mailClass.FromMail);
                    mailClass.ToMails.ForEach(m =>
                    {
                        mail.To.Add(m);
                    });
                    mail.Subject = mailClass.Subject;
                    mail.Body = mailClass.Body;
                    mail.IsBodyHtml = mailClass.IsBodyHtml;
                    using(SmtpClient smtp=new SmtpClient("smtp.gmail.com", 587))
                    {
                        smtp.Credentials = new NetworkCredential(mailClass.FromMail, mailClass.FromMailPassword);
                        smtp.EnableSsl = true;
                        await smtp.SendMailAsync(mail);
                        return "Сообщение отправлено";
                    }
                }
            }
            catch(Exception ex)
            {
                return ex.Message;
            }
        }

        public string GetMailBody(string url, string username)
        {
            return $"<div><p>Здравствуйте, {username}, кликните по ссылке ниже, чтобы подтвердить свою почту</p><a href='{url}'>Подтвердить почту</a></div>";
        }
    }
}
