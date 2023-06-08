using UserApi.Models;

namespace UserApi.JwtToken
{
    public interface IJWTManagerRepository
    {
        Tokens GetToken(GetJwtRequest request);
    }
}

