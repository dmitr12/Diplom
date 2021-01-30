using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CourseProjectMusic.Utils
{
    public class AuthOptions
    {
        public string Issuer { get; set; }
        public string Audience { get; set; }
        public string Secret { get; set; } // секретная строка для генерации токена
        public int TokenLifeTime { get; set; } // длительность жизни токена в секундах
        public SymmetricSecurityKey GetSymmetricSecurityKey() // метод генерации ключа
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Secret));
        }
    }
}
