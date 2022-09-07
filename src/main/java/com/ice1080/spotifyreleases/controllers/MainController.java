package com.ice1080.spotifyreleases.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping("spotify-redirect")
    void spotifyRedirect() {
        // todo
    }
}
