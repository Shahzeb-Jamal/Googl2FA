//using System;
//using System.Collections.Generic;
//using System.IdentityModel.Tokens.Jwt;
//using System.Security.Claims;
//using System.Text;
//using Microsoft.IdentityModel.Tokens;

//namespace UserApi.JwtToken
//{
//    public class JwtTokenGenerator
//    {
//        private readonly string secretKey;
//        private readonly string issuer;
//        private readonly string audience;
//        private readonly int expirationMinutes;

//        public JwtTokenGenerator(string secretKey, string issuer, string audience, int expirationMinutes)
//        {
//            this.secretKey = secretKey;
//            this.issuer = issuer;
//            this.audience = audience;
//            this.expirationMinutes = expirationMinutes;
//        }

//        public string GenerateToken(IDictionary<string, string> claims)
//        {
//            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
//            var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

//            var tokenClaims = new List<Claim>
//            {
//                new Claim(JwtRegisteredClaimNames.Sub, "subject"),
//                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
//                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
//            };

//            foreach (var claim in claims)
//            {
//                tokenClaims.Add(new Claim(claim.Key, claim.Value));
//            }

//            var token = new JwtSecurityToken(
//                issuer: issuer,
//                audience: audience,
//                claims: tokenClaims,
//                expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
//                signingCredentials: signingCredentials
//            );

//            var encodedToken = new JwtSecurityTokenHandler().WriteToken(token);

//            return encodedToken;
//        }
//    }
//}
