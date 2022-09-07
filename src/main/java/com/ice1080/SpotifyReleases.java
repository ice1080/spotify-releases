package com.ice1080;

import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;

import java.net.URI;

// todo remove this file

public class SpotifyReleases {
    private static final String clientId = System.getenv("SPOTIFY_RELEASE_CLIENT_ID");
    private static final String clientSecret = System.getenv("SPOTIFY_RELEASE_CLIENT_SECRET");
    private static final URI redirectUri = SpotifyHttpManager.makeUri("https://example.com/spotify-redirect");
    private static String code = "";

    private static final SpotifyApi spotifyApi = new SpotifyApi.Builder()
            .setClientId(clientId)
            .setClientSecret(clientSecret)
            .setRedirectUri(redirectUri)
            .build();
    private static final AuthorizationCodeUriRequest authorizationCodeUriRequest = spotifyApi.authorizationCodeUri()
//          .state("x4xkmn9pu3j6ukrs8n")
//          .scope("user-read-birthdate,user-read-email")
//          .show_dialog(true)
            .build();
    private static final AuthorizationCodeRequest authorizationCodeRequest = spotifyApi.authorizationCode(code)
            .build();

    private static void printAuthUri() {
        final URI uri = authorizationCodeUriRequest.execute();

        System.out.println("URI: " + uri.toString());
    }

    public static void main(String[] args) {
        System.out.println("Hello world!");
        printAuthUri();
//        try {
//            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRequest.execute();
//
//            // Set access and refresh token for further "spotifyApi" object usage
//            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());
//            spotifyApi.setRefreshToken(authorizationCodeCredentials.getRefreshToken());
//            System.out.println(spotifyApi.getAccessToken());
//        } catch (Throwable t) {
//            System.out.println(t.getMessage());
//            t.printStackTrace();
//        }
    }
}
