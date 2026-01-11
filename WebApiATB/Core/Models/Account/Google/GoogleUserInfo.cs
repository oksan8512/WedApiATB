namespace Core.Models.Account.Google;

public class GoogleUserInfo
{
    public string Email { get; set; } = string.Empty;
    public string GivenName { get; set; } = string.Empty;
    public string FamilyName { get; set; } = string.Empty;
    public bool VerifiedEmail { get; set; }
}