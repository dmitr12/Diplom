using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CourseProjectMusic.Models
{
    public class MusicPostModel
    {
        public IFormFile asset { get; set; }
    }
}
