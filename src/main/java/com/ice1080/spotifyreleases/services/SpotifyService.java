package com.ice1080.spotifyreleases.services;

import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;

import java.net.URI;

@Service
public class SpotifyService {
    private static final String clientId = System.getenv("SPOTIFY_RELEASE_CLIENT_ID");
    private static final String clientSecret = System.getenv("SPOTIFY_RELEASE_CLIENT_SECRET");
    // todo change to current hostname
    private static final URI redirectUri = SpotifyHttpManager.makeUri("http://localhost:8080/spotify-redirect");
    private static String code = "";

    private static final SpotifyApi spotifyApi = new SpotifyApi.Builder()
            .setClientId(clientId)
            .setClientSecret(clientSecret)
            .setRedirectUri(redirectUri)
            .build();

    static URI getAuthUri() {
        AuthorizationCodeUriRequest authorizationCodeUriRequest = spotifyApi.authorizationCodeUri().build();

        return authorizationCodeUriRequest.execute();
    }

}
