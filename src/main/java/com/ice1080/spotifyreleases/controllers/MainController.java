package com.ice1080.spotifyreleases.controllers;

import com.ice1080.spotifyreleases.services.SpotifyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @Autowired
    SpotifyService spotifyService;

    @GetMapping("spotify-redirect")
    void spotifyRedirect() {
        // todo
    }

}
