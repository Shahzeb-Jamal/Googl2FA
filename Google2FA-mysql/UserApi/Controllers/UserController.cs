using Google.Authenticator;
using JWT;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using UserApi.Config;
using UserApi.JwtToken;
using UserApi.Models;
using UserApi.Repository;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IJWTManagerRepository _jWTManager;
    private readonly IUserRepository _userRepository;
    private readonly Google2FAConfig _google2FAConfig;
    private readonly ILogger<UsersController> _logger;
    //private readonly TwoFactorAuthenticator _TwoFacAuth;

    public UsersController(IJWTManagerRepository jWTManager, IUserRepository userRepository, ILogger<UsersController> logger, IOptions<Google2FAConfig> options)
    {
        this._jWTManager = jWTManager;
        this._userRepository = userRepository;
        this._logger = logger;
        this._google2FAConfig = options.Value;
        
    }

    [HttpGet]
    public ActionResult GetUserData()
    {
        // Retrieve token
        string token = Request.Headers["Authorization"];

        // Decode token
        var decodedToken = BearerTokenDecoder.DecodeBearerToken(token);

        // Get user name from token
        var username = decodedToken.Claims.FirstOrDefault(c => c.Type == "Username")?.Value;

        // Get user data from db using UserRepository
        var userData = _userRepository.GetUser(username);

        // Do 2FA Auth for that user
        var UserUniqueKey = userData.Username + userData.SecretKey;

        TwoFactorAuthenticator TwoFacAuth = new TwoFactorAuthenticator();
        var setupInfo = TwoFacAuth.GenerateSetupCode(_google2FAConfig.Issuer, userData.Username, ConvertSecretToBytes(UserUniqueKey, false), 300);
        // Return response with username and 2FA QR Code Url
        return Ok(new AuthenticateUserResult
        {
            Success = true,
            ManualEntryKey = setupInfo.ManualEntryKey,
            QrCodeSetupImageUrl = setupInfo.QrCodeSetupImageUrl,
            UserUniqueKey = UserUniqueKey,
            TwoFAStatus = userData.TwoFAStatus
        });    
    }

    [AllowAnonymous]
    [HttpPost]
    [Route("token")]
    public IActionResult GetToken(GetJwtRequest request)
    {
        var token = _jWTManager.GetToken(request);

        if (token == null)
        {
            return Unauthorized();
        }

        return Ok(token);
    }
    private static byte[] ConvertSecretToBytes(string secret, bool secretIsBase32) =>
   secretIsBase32 ? Base32Encoding.ToBytes(secret) : Encoding.UTF8.GetBytes(secret);
}
