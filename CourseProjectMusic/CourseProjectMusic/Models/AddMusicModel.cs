using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CourseProjectMusic.Models
{
    public class AddMusicModel
    {
        public IFormFile MusicFile { get; set; } 
        public IFormFile MusicImageFile { get; set; }
        public int MusicGenreId { get; set; }
        public string MusicName { get; set; }
    }
}
