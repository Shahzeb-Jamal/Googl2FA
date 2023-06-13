using Microsoft.AspNetCore.Mvc;
using System.Collections.Concurrent;
using System.Drawing.Imaging;
using System.Drawing;
using System.Text;
using System.Security.Cryptography;
using UserApi.Models;
using UserApi.JwtToken;

namespace UserApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CaptchaController : ControllerBase
        
    {
        private const int CaptchaLength = 6;
        private const int CaptchaExpirationMinutes = 10;

        private static readonly ConcurrentDictionary<string, CaptchaInfo> CaptchaDictionary = new ConcurrentDictionary<string, CaptchaInfo>();

        [HttpGet]
        [Route("GetCaptcha")]
        public IActionResult GenerateCaptcha()
        {
            var captchaText = GenerateRandomString(CaptchaLength);
            var encryptedCaptcha = EncryptString(captchaText);
            var captchaImage = GenerateCaptchaImage(captchaText);

            var captchaId = "f0cd5312-914b-49ad-9c7c-5caaec7f7d29";
            //var captchaId = Guid.NewGuid().ToString();
            
            var captchaInfo = new CaptchaInfo
            {
                EncryptedCaptcha = encryptedCaptcha,
                ExpirationTime = DateTime.UtcNow.AddMinutes(CaptchaExpirationMinutes)
            };

            CaptchaDictionary.TryAdd(captchaId, captchaInfo);

            var stream = new MemoryStream();
            captchaImage.Save(stream, ImageFormat.Png);
            stream.Seek(0, SeekOrigin.Begin);
        
            return File(stream, "image/png");
        }

        [HttpPost]
        [Route("ValidateCaptcha")]
        public IActionResult ValidateCaptcha([FromBody] CaptchaValidationRequest request)
        {
            if (CaptchaDictionary.TryRemove(request.CaptchaId, out var captchaInfo))
            {
                if (captchaInfo.ExpirationTime < DateTime.UtcNow)
                {
                    return BadRequest("Captcha expired");
                }

                var encryptedCaptcha = EncryptString(request.Captcha);
                if (encryptedCaptcha == captchaInfo.EncryptedCaptcha)
                {
                    return Ok("Captcha validation successful");
                }
            }

            return BadRequest("Invalid captcha");
        }

        private string GenerateRandomString(int length)
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            var stringBuilder = new StringBuilder();

            for (int i = 0; i < length; i++)
            {
                stringBuilder.Append(chars[random.Next(chars.Length)]);
            }

            return stringBuilder.ToString();
        }

        private string EncryptString(string input)
        {
            using var sha256 = SHA256.Create();
            var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
            var builder = new StringBuilder();

            foreach (var b in hashBytes)
            {
                builder.Append(b.ToString("x2"));
            }

            return builder.ToString();
            //return input;   
        }

        private Image GenerateCaptchaImage(string text)
        {
            const int width = 200;
            const int height = 80;

            var image = new Bitmap(width, height);
            var graphics = Graphics.FromImage(image);
            var font = new Font(FontFamily.GenericMonospace, 40, FontStyle.Bold);
            var brush = Brushes.Black;

            graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
            graphics.Clear(Color.White);
            graphics.DrawString(text, font, brush, 10, 10);

            return image;
        }
    }
}


