//using System.Security.Cryptography;

//namespace UserApi.JwtToken
//{
//    public static class NumberToGuidConverter
//    {
//        public static Guid NumberToGuid(int number)
//        {
//            byte[] numberBytes = BitConverter.GetBytes(number);

//            using (var sha1 = SHA1.Create())
//            {
//                byte[] hashedBytes = sha1.ComputeHash(numberBytes);
//                Array.Resize(ref hashedBytes, 16); // Keep only the first 16 bytes

//                return new Guid(hashedBytes);
//            }
//        }
//    }

//}
