namespace UserApi.Models
{
    public class CaptchaValidationResponse
    {
        public bool IsValid { get; set; }
        public string Message { get; set; }
    }
}
