namespace UserApi.Models
{
    public class GetJwtResult
    {
        public bool Success { get; set; }
        public string Jwt { get; set; }
        public string UserUniqueKey { get; set; }
        public string QrCodeSetupImageUrl { get; set; }
        public string ManualEntryKey { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public bool TwoFAStatus { get; set; }
    }
}