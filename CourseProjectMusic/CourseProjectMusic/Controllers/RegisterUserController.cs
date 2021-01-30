using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
        private readonly IOptions<StorageConfiguration> storageConfig;

        public RegisterUserController(DataBaseContext db, IOptions<StorageConfiguration> sc)
        {
            this.db = db;
            storageConfig = sc;
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
                    RoleId=1, Avatar="user_icon.png"};
                try
                {
                    db.Users.Add(user);
                    await db.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.InnerException.Message);
                }
                return Ok(new {msg=""});
            }
            return BadRequest();
        }
    }
}
