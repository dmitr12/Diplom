﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CourseProjectMusic.Interfaces;
using CourseProjectMusic.Models;
using CourseProjectMusic.Utils;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace CourseProjectMusic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegisterUserController : ControllerBase
    {
        DataBaseContext db;
        private IMailService mailService;
        private IOptions<AuthOptions> authOptions;

        public RegisterUserController(DataBaseContext db, IMailService mailService, IOptions<AuthOptions> authOptions)
        {
            this.db = db;
            this.mailService = mailService;
            this.authOptions = authOptions;
        }

        [HttpPost]
        public async Task<ActionResult> Register(RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                User us = await db.Users.Where(u => u.Mail == model.Mail).FirstOrDefaultAsync();
                if (us != null)
                    return Ok(new { msg = $"Пользователь с {model.Mail} уже зарегистрирован" });  
                us= await db.Users.Where(u => u.Login == model.Login).FirstOrDefaultAsync();
                if(us!=null)
                    return Ok(new { msg = $"Пользователь с {model.Login} уже зарегистрирован" });
                User user = new User { Mail = model.Mail, Login = model.Login, Password = HashClass.GetHash(model.Password),
                    RoleId=1, IsMailConfirmed=false};
                try
                {
                    db.Users.Add(user);
                    await db.SaveChangesAsync();
                    MailClass mailClass = new MailClass();
                    mailClass.Subject = "Подтверждение почты";
                    mailClass.Body = mailService.GetMailBody(authOptions.Value.Issuer+ $"api/RegisterUser/ConfirmEmail?username={model.Login}", model.Login);
                    mailClass.ToMails = new List<string>()
                    {
                        model.Mail
                    };
                    await mailService.SendMail(mailClass);
                    return Ok(new { msg = $"Регистрация прошла успешно, на {model.Mail} было отправлено письмо для подтверждения почты" });
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.InnerException.Message);
                }
            }
            return BadRequest();
        }

        [HttpGet("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail(string username)
        {
            User user = await db.Users.Where(u=>u.Login==username).FirstOrDefaultAsync();
            if(user==null)
                return Ok(new { message = "Неверный пользователь" });
            user.IsMailConfirmed = true;
            await db.SaveChangesAsync();
            return Ok(new { message = "Почта успешно подтверждена" });
        }
    }
}
