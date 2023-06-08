using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using UserApi.Models;

namespace UserApi.Repository
{
    public class JWTManagerRepository : IJWTManagerRepository
    {
        private readonly IUserRepository _userRepository;

        public JWTManagerRepository(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
        public Tokens GetToken(GetJwtRequest request)
        {
            var user = _userRepository.GetUser(request.UserName, request.Password);
            if (user == null)
            {
                return null;
            }

            // Else we generate JSON Web Token
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.UTF8.GetBytes("z*mX6Jr%kia5j@JyP23p84ch3Wu265RFprKOH6QOK!V^!U7l!wz*mX6Jr%kia5j@JyP23p84ch3Wu265RFprKOH6QOK!V^!U7l!w");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
              {
             new Claim(ClaimTypes.Name, request.UserName)
              }),
                Expires = DateTime.UtcNow.AddMinutes(10),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return new Tokens { Token = tokenHandler.WriteToken(token) };

        }
    }
}
