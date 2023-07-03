namespace Googl2FA.Models
{
    public class AuthenticateUserRequest
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Google2FACode { get; set; }
    }
}