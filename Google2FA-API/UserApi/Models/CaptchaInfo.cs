namespace UserApi.Models
{
    public class CaptchaInfo
    {
        public string EncryptedCaptcha { get; set; }
        public DateTime ExpirationTime { get; set; }
    }
}
