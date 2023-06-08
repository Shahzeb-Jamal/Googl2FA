using System.IdentityModel.Tokens.Jwt;

namespace UserApi.JwtToken
{
    public class BearerTokenDecoder
    {
        public static JwtSecurityToken DecodeBearerToken(string bearerToken)
        {
            var token = bearerToken.Split(' ')[1]; // Extract token without "Bearer " prefix

            var handler = new JwtSecurityTokenHandler();
            var tokenString = token;

            var decodedToken = handler.ReadJwtToken(tokenString);

            return decodedToken; // Return the decoded token as a string
        }
    }
}
