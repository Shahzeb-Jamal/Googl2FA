namespace UserApi.Models
{
    public class Validate2FACodeRequest
    {
        public bool Success { get; set; }
        public string Google2FACode { get; set; }

    }
}
