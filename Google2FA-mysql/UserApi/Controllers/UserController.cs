using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    public List<string> Get()
    {
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
