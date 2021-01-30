using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using CG.Web.MegaApiClient;
using CourseProjectMusic.Models;
using CourseProjectMusic.Utils;
using Dropbox.Api;
using Dropbox.Api.Files;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace CourseProjectMusic.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MusicController : ControllerBase
    {
        private readonly DataBaseContext db;
        private readonly IConfiguration config;
        private readonly IOptions<StorageConfiguration> storageConfig;
        private int UserId => int.Parse(User.Claims.Single(cl => cl.Type == ClaimTypes.NameIdentifier).Value);
        public MusicController(DataBaseContext db, IConfiguration config, IOptions<StorageConfiguration> sc)
        {
            this.db = db;
            this.config = config;
            storageConfig = sc;
        }

        [HttpGet("FilterMusic")]
        public async Task<List<MusicInfo>> GetFilteredList(string musicName, int genreId)
        {
            FilteredMusicList fl = new FilteredMusicList { MusicName = musicName == null ? "" : musicName, GenreId = genreId };
            string musicNameFilter = fl.MusicName.Length > 0 ? fl.MusicName : String.Empty;
            string musicGenreFilter = fl.GenreId > 0 ? fl.GenreId.ToString() : "%";
            List<MusicInfo> res = new List<MusicInfo>();
            try
            {
                res = await db.Musics.Where(m => EF.Functions.Like(m.MusicName, $"%{musicNameFilter}%")
                  & EF.Functions.Like(m.MusicGenreId.ToString(), $"{musicGenreFilter}")).Join(db.Users, m => m.UserId, u => u.UserId, (m, u) => new MusicInfo
                  {
                      Id = m.MusicId,
                      Name = m.MusicName,
                      MusicUrl = m.MusicUrl,
                      ImageUrl = m.MusicImageUrl,
                      GenreId = m.MusicGenreId,
                      UserId = u.UserId,
                      UserLogin = u.Login
                  }).ToListAsync();
                return res;
            }
            catch
            {
                Response.StatusCode = 500;
                return new List<MusicInfo>();
            }
        }

        [HttpPost("LikeMusic/{idMusic}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> LikeMusic(int idMusic)
        {
            try
            {
                db.UserMusicLikes.Add(new UserMusicLike { MusicId = idMusic, UserId = UserId });
                await db.SaveChangesAsync();
                return Ok();
            }
            catch { return StatusCode(500); }
        }

        [HttpDelete("DeleteLikeMusic/{idMusic}")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> DeleteLikeMusic(int idMusic)
        {
            try
            {
                db.UserMusicLikes.Remove(new UserMusicLike { MusicId = idMusic, UserId = UserId });
                await db.SaveChangesAsync();
                return Ok();
            }
            catch { return StatusCode(500); }
        }

        [HttpGet("{id}")]
        public async Task<MusicInfo> GetMusicInfoById(int id)
        {
            Music music = await db.Musics.FindAsync(id);
            return new MusicInfo
            {
                Id = music.MusicId,
                Name = music.MusicName,
                MusicUrl=music.MusicUrl,
                ImageUrl = music.MusicImageUrl,
                GenreId = music.MusicGenreId,
                UserId = music.UserId,
                UserLogin = await db.Users.Where(u => u.UserId == music.UserId).Select(u => u.Login).FirstOrDefaultAsync(),
                IdOfUsersLike = await db.UserMusicLikes.Where(um => um.MusicId == id).Select(um => um.UserId).ToArrayAsync()
            };
        }

        [HttpGet("list/{userid}")]
        public async Task<List<MusicInfo>> GetMusicListByUserId(int userid)
        {
            List<MusicInfo> res = new List<MusicInfo>();
            await db.Musics.Where(m => m.UserId == userid).ForEachAsync(m => res.Add(new MusicInfo {Id=m.MusicId, Name = m.MusicName, MusicUrl = m.MusicUrl, 
                ImageUrl=m.MusicImageUrl, GenreId=m.MusicGenreId, UserId=m.UserId }));
            return res;
        }

        [HttpGet("listMusicGenres")]
        public async Task<List<MusicGenreInfo>> GetMusicGenresList()
        {
            List<MusicGenreInfo> res = new List<MusicGenreInfo>();
            await db.MusicGenres.ForEachAsync(g => res.Add(new MusicGenreInfo { Id = g.MusicGenreId, Name = g.GenreName, Description = g.GenreDescription }));
            return res;
        }

        [HttpPost("AddMusic")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> AddMusic([FromForm]AddMusicModel model)
        {
            User user = await db.Users.FindAsync(UserId);
            string dateTimeNow = $"{DateTime.Now.Day}.{DateTime.Now.Month}.{DateTime.Now.Year} {DateTime.Now.Hour}:{DateTime.Now.Minute}:{DateTime.Now.Second}";
            if (await db.Musics.Where(m=>m.UserId==user.UserId && m.MusicName==model.MusicName).FirstOrDefaultAsync()!=null)
                return Ok(new { msg = $"У вас уже есть запись с названием {model.MusicName}" });
            string musicFileName = $"{user.Login}_{dateTimeNow}_" + model.MusicFile.FileName;
            string sharingLinkMusic = "";
            string sharingLinkImage = "";
            try
            {
                using (var dbx=new DropboxClient("DOQxivsHU0IAAAAAAAAAATKvLBL5W4hcPBmeK-zbd3QJdGZMSr6cz2PY0kMOsJ6t"))
                {
                    var list= dbx.Files.ListFolderAsync(string.Empty).Result;
                    if(list.Entries.Where(i => i.Name == musicFileName).FirstOrDefault() != null)
                        return Ok(new { msg = $"В вашем хранилище уже есть файл {model.MusicFile.FileName}" });
                    if (model.MusicImageFile != null)
                    {
                        if(list.Entries.Where(i=>i.Name== $"{user.Login}_music_{dateTimeNow}_" + model.MusicImageFile.FileName).FirstOrDefault()!=null)
                            return Ok(new { msg = $"В вашем хранилище уже есть файл {model.MusicImageFile.FileName}" });
                        await dbx.Files.UploadAsync("/" + $"{user.Login}_music_{dateTimeNow}_" + model.MusicImageFile.FileName, WriteMode.Overwrite.Instance, body: model.MusicImageFile.OpenReadStream());
                        var img = dbx.Sharing.CreateSharedLinkWithSettingsAsync("/" + $"{user.Login}_music_{dateTimeNow}_" + model.MusicImageFile.FileName).Result;
                        sharingLinkImage = img.Url.Remove(img.Url.Length - 1) + "1";
                    }
                    await dbx.Files.UploadAsync("/" + musicFileName, WriteMode.Overwrite.Instance, body: model.MusicFile.OpenReadStream());
                    var msc = dbx.Sharing.CreateSharedLinkAsync("/" + musicFileName).Result;
                    sharingLinkMusic= msc.Url.Remove(msc.Url.Length - 1) + "1";
                    db.Musics.Add(new Music
                    {
                        MusicName = model.MusicName,
                        MusicFileName = musicFileName,
                        MusicUrl=sharingLinkMusic,
                        MusicImageName = model.MusicImageFile == null ? "default.png" : $"{user.Login}_music_{dateTimeNow}_" + model.MusicImageFile.FileName,
                        MusicImageUrl= model.MusicImageFile == null? "https://www.dropbox.com/s/jattf04mjk4x903/default.png?dl=1" : sharingLinkImage,
                        UserId = user.UserId,
                        DateOfPublication = DateTime.Now.Date,
                        MusicGenreId = model.MusicGenreId
                    });
                    await db.SaveChangesAsync();
                    return Ok(new { msg = "" });
                }
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpPut("EditMusic")]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> EditMusic([FromForm] EditMusicModel model)
        {
            string musicFileName, imageFileName;
            User user = await db.Users.FindAsync(UserId);
            Music music = await db.Musics.FindAsync(model.Id);
            string dateTimeNow = $"{DateTime.Now.Day}.{DateTime.Now.Month}.{DateTime.Now.Year} {DateTime.Now.Hour}:{DateTime.Now.Minute}:{DateTime.Now.Second}";
            try
            {
                using (var dbx = new DropboxClient("DOQxivsHU0IAAAAAAAAAATKvLBL5W4hcPBmeK-zbd3QJdGZMSr6cz2PY0kMOsJ6t"))
                {
                    var list = dbx.Files.ListFolderAsync(string.Empty).Result;
                    if (model.MusicFile != null)
                    {
                        musicFileName = $"{user.Login}_{dateTimeNow}_" + model.MusicFile.FileName;
                        if (list.Entries.Where(i => i.Name == music.MusicFileName).FirstOrDefault() != null)
                            await dbx.Files.DeleteAsync("/" + music.MusicFileName);
                        await dbx.Files.UploadAsync("/" + musicFileName, WriteMode.Overwrite.Instance, body: model.MusicFile.OpenReadStream());
                        var msc = dbx.Sharing.CreateSharedLinkAsync("/" + musicFileName).Result;
                        music.MusicUrl = msc.Url.Remove(msc.Url.Length - 1) + "1";
                        music.MusicFileName = musicFileName;
                    }
                    if (model.MusicImageFile != null)
                    {
                        imageFileName = $"{user.Login}_music_{dateTimeNow}_" + model.MusicImageFile.FileName;
                        if (list.Entries.Where(i => i.Name == music.MusicImageName && i.Name!="default.png").FirstOrDefault() != null)
                            await dbx.Files.DeleteAsync("/" + music.MusicImageName);
                        await dbx.Files.UploadAsync("/" + imageFileName, WriteMode.Overwrite.Instance, body: model.MusicImageFile.OpenReadStream());
                        var msc = dbx.Sharing.CreateSharedLinkAsync("/" + imageFileName).Result;
                        music.MusicImageUrl = msc.Url.Remove(msc.Url.Length - 1) + "1";
                        music.MusicImageName = imageFileName;
                    }
                    music.MusicName = model.MusicName;
                    music.MusicGenreId = model.MusicGenreId;
                    await db.SaveChangesAsync();
                    return Ok(new { msg = "" });
                }
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [Authorize(Roles = "User")]
        [HttpDelete("Delete/{id}")]
        public async Task<List<MusicInfo>> DeleteMusic(int id)
        {
            User user = await db.Users.FindAsync(UserId);
            Music music = await db.Musics.FindAsync(id);
            List<MusicInfo> res = new List<MusicInfo>();
            if (music != null)
            {
                try
                {
                    using (var dbx = new DropboxClient("DOQxivsHU0IAAAAAAAAAATKvLBL5W4hcPBmeK-zbd3QJdGZMSr6cz2PY0kMOsJ6t"))
                    {
                        var list = dbx.Files.ListFolderAsync(string.Empty).Result;
                        if (list.Entries.Where(i => i.Name == music.MusicFileName).FirstOrDefault() != null)
                            await dbx.Files.DeleteAsync("/" + music.MusicFileName);
                        if (list.Entries.Where(i => i.Name == music.MusicImageName && i.Name != "default.png").FirstOrDefault() != null)
                            await dbx.Files.DeleteAsync("/" + music.MusicImageName);
                        db.Musics.Remove(music);
                        await db.SaveChangesAsync();
                    }
                }
                catch
                {
                }
            }
            return await GetMusicListByUserId(UserId);
        }
    }
}
