using JWT;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using UserApi.JwtToken;
using UserApi.Models;
using UserApi.Repository;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IJWTManagerRepository _jWTManager;

    public UsersController(IJWTManagerRepository jWTManager)
    {
        this._jWTManager = jWTManager;
    }

    [HttpGet]
    public List<string> GetUserData()
    {
        // Retrieve token
        string token = Request.Headers["Authorization"];
        // Decode token
       // BearerTokenDecoder bearerTokenDecoder= new BearerTokenDecoder();
        var decodedToken = BearerTokenDecoder.DecodeBearerToken(token);
        // Get user name from token
        var username = decodedToken.Claims.FirstOrDefault(c => c.Value == "user1")?.Value;
        // Do 2FA Auth for that user

        // Return response with username and 2FA QR Code Url
        var users = new List<string>
        {
            "Shahzeb Jamal",
            
        };

        return users;
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
}
