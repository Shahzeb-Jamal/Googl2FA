using UserApi.Models;

namespace UserApi.Repository
{
    public interface IJWTManagerRepository
    {
        Tokens GetToken(GetJwtRequest request);
    }
}

