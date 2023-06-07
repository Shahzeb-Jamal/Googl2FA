using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace UserApi.JwtToken
{
    public static class JwtGenerator
    {
        public static string GenerateJwtWithGuidClaim(Guid guid)
        {
            // Create the claims for the JWT
            var claims = new[]
            {
            new Claim("guid", guid.ToString())
        };

            // Generate the JWT
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            // Replace this with your own secret key
            string secretKey = "z*mX6Jr%kia5j@JyP23p84ch3Wu265RFprKOH6QOK!V^!U7l!wz*mX6Jr%kia5j@JyP23p84ch3Wu265RFprKOH6QOK!V^!U7l!w";
            byte[] keyBytes = Encoding.UTF8.GetBytes(secretKey);

            return new SymmetricSecurityKey(keyBytes);
        }
    }
}
