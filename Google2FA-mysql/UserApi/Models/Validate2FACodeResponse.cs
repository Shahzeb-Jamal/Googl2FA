namespace UserApi.Models
{
    public class Validate2FACodeResponse
    {
        public bool Success { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;

    }
}
