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
        public const int CaptchaLength = 6;
        public const int CaptchaExpirationMinutes = 10;

       // private static readonly ConcurrentDictionary<string, CaptchaInfo> CaptchaDictionary = new ConcurrentDictionary<string, CaptchaInfo>();
        private static readonly List<CaptchaInfo> captchaList = new List<CaptchaInfo>();

        [HttpGet]
        [Route("GetCaptcha")]
        public IActionResult GenerateCaptcha()
        {
            var captchaText = GenerateRandomString(CaptchaLength);
            var encryptedCaptcha = EncryptString(captchaText);
            var captchaImage = GenerateCaptchaImage(captchaText);

            // var captchaId = "f0cd5312-914b-49ad-9c7c-5caaec7f7d29";
            //var captchaId = Guid.NewGuid().ToString();

            var captchaInfo = new CaptchaInfo
            {
                EncryptedCaptcha = encryptedCaptcha,
                ExpirationTime = DateTime.UtcNow.AddMinutes(CaptchaExpirationMinutes)
            };

            //CaptchaDictionary.TryAdd(captchaId, captchaInfo);
            captchaList.Add(captchaInfo);

            var imagestream = new MemoryStream();
            captchaImage.Save(imagestream, ImageFormat.Png);
            imagestream.Seek(0, SeekOrigin.Begin);
            var base64Image = Convert.ToBase64String(imagestream.ToArray());

            return Ok(new CaptchaGenerationResponse
            {
               // CaptchaId = captchaId,
                EncryptedCaptcha = encryptedCaptcha,
                CaptchaImage = base64Image
            });
        }

        [HttpPost]
        [Route("ValidateCaptcha")]
        public IActionResult ValidateCaptcha([FromBody] CaptchaValidationRequest request)
        {
            var encryptedCaptcha = EncryptString(request.Captcha);

            var captchaInfo = captchaList.Find(x => x.EncryptedCaptcha.Equals(encryptedCaptcha));
            if (captchaInfo != null)
            {
                if (captchaInfo.ExpirationTime < DateTime.UtcNow)
                {
                    return BadRequest("Captcha expired");
                }

                if (encryptedCaptcha == captchaInfo.EncryptedCaptcha)
                {
                    // Remove matched item from list before retunring successful validation
                    var itemtoremove = captchaList.Where(item => item.EncryptedCaptcha == encryptedCaptcha).First();
                    captchaList.Remove(itemtoremove);

                    return Ok(new CaptchaValidationResponse
                    {
                        IsValid = true,
                        Message = "Captcha validation successful"
                    });
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
            const int width = 250;
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


