using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CourseProjectMusic.Models
{
    public class MusicGenre
    {
        public int MusicGenreId { get; set; }

        [Required]
        public string GenreName { get; set; }

        [Required]
        public string GenreDescription { get; set; }

        public List<Music> Musics { get; set; }
    }
}
