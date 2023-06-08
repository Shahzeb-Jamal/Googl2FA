using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using UserApi.Config;
using UserApi.Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.ResolveConflictingActions(apiDescriptions => apiDescriptions.First());
});

builder.Services.Configure<Google2FAConfig>(
    builder.Configuration.GetSection("Google2FAConfig"));

builder.Services.AddScoped<IUserRepository, UserRepository>();
// For sql server
//builder.Services.AddDbContext<UserDbContext> (o => o.UseSqlServer(builder.Configuration.GetConnectionString("UsersSqlServerDb")));

// For my sql
var connectionString = builder.Configuration.GetConnectionString("UsersMySqlServerDb");
builder.Services.AddDbContext<UserDbContext>(o => o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));


builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(o =>
{
    var Key = Encoding.UTF8.GetBytes("z*mX6Jr%kia5j@JyP23p84ch3Wu265RFprKOH6QOK!V^!U7l!wz*mX6Jr%kia5j@JyP23p84ch3Wu265RFprKOH6QOK!V^!U7l!w");
    o.SaveToken = true;
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = false,
        ValidateIssuerSigningKey = false,
        ValidIssuer = "Shahzeb",
        ValidAudience = "Jamal",
        IssuerSigningKey = new SymmetricSecurityKey(Key)
    };
});

builder.Services.AddScoped<IJWTManagerRepository, JWTManagerRepository>();

builder.Services.AddControllers();


var app = builder.Build();

//app.UseCors(policy => policy.AllowAnyOrigin());
app.UseCors(policy => policy.AllowAnyHeader().AllowAnyMethod().SetIsOriginAllowed(origin => true).AllowCredentials());


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
