using UserApi.JwtToken;

namespace TestApp
{
    internal class Program
    {
        static void Main(string[] args)
        {
            JwtTokenGenerator token = new JwtTokenGenerator("IwOnQI58eXStQt3dfsdfgdsf345dfgsdfhsdhdsfhsdgsdfhdfsshdhdssd43", "shahzeb", "jamal", 15);
            var claims = new Dictionary<string, string>
            {
                { "Username", "Admin" },
                { "Password", "12345" },
            };
            var jwt = token.GenerateToken(claims);
            Console.WriteLine(jwt);
        }
    }
}