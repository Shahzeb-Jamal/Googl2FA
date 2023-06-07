using UserApi.Models;

namespace UserApi.Repository
{
    public interface IJWTManagerRepository
    {
        Tokens Authenticate(User user);
    }
}

