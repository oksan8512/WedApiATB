using System.Text.Json.Serialization;

namespace Core.Models.Account.Google;

public class GoogleTokenResponse
{
    [JsonPropertyName("access_token")]
    public string AccessToken { get; set; } = string.Empty;

    [JsonPropertyName("id_token")]
    public string IdToken { get; set; } = string.Empty;

    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
}