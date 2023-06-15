namespace UserApi.Models
{
    public class CaptchaGenerationResponse
    {
        

        public string CaptchaId { get; internal set; }
        public string CaptchaImage { get; internal set; }
        public string EncryptedCaptcha { get; internal set; }
    }
}
