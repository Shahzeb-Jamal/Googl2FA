using MySqlConnector;

namespace UserApi.Models
{
    public class CaptchaPersistence
    {
        private const string ConnectionString = "Server=localhost;Database=UsersDb;Uid=root;Pwd=sept22;";

        public void AddCaptcha(CaptchaInfo captchaInfo)
        {
            using (var connection = new MySqlConnection(ConnectionString))
            {
                connection.Open();

                EnsureTableCreated(connection);

                string query = "INSERT INTO Captchas (EncryptedCaptcha, ExpirationTime) VALUES (@EncryptedCaptcha, @ExpirationTime)";
                using (var command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@EncryptedCaptcha", captchaInfo.EncryptedCaptcha);
                    command.Parameters.AddWithValue("@ExpirationTime", captchaInfo.ExpirationTime);
                    command.ExecuteNonQuery();
                }
            }
        }

        public CaptchaInfo RetrieveCaptcha(string encryptedCaptcha)
        {
            using (var connection = new MySqlConnection(ConnectionString))
            {
                connection.Open();

                EnsureTableCreated(connection);

                string query = "SELECT EncryptedCaptcha, ExpirationTime FROM Captchas WHERE EncryptedCaptcha = @EncryptedCaptcha";
                using (var command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@EncryptedCaptcha", encryptedCaptcha);

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var captchaInfo = new CaptchaInfo
                            {
                                EncryptedCaptcha = reader.GetString("EncryptedCaptcha"),
                                ExpirationTime = reader.GetDateTime("ExpirationTime")
                            };

                            return captchaInfo;
                        }
                    }
                }
            }

            return null;
        }

        public void RemoveCaptcha(CaptchaInfo captchaInfo)
        {
            using (var connection = new MySqlConnection(ConnectionString))
            {
                connection.Open();

                EnsureTableCreated(connection);

                string query = "DELETE FROM Captchas WHERE EncryptedCaptcha = @EncryptedCaptcha";
                using (var command = new MySqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@EncryptedCaptcha", captchaInfo.EncryptedCaptcha);
                    command.ExecuteNonQuery();
                }
            }
        }

        private void EnsureTableCreated(MySqlConnection connection)
        {
            string query = @"
                CREATE TABLE IF NOT EXISTS Captchas
                (
                    Id INT PRIMARY KEY AUTO_INCREMENT,
                    EncryptedCaptcha NVARCHAR(1000) NOT NULL,
                    ExpirationTime DATETIME NOT NULL
                )";

            using (var command = new MySqlCommand(query, connection))
            {
                command.ExecuteNonQuery();
            }
        }
    }
}