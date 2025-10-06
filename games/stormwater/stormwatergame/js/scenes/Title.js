"use strict";

var TitleState = {
  preload: function () {},
  create: function () {
    // Background
    this.backgroundSprite = this.add.sprite(0, 0, "background_1");

    // Clouds
    this.cloudSprites = createCloudSprites(this);

    // Titles
    this.titleProfessorSprite = this.add.sprite(
      0.03 * WIDTH,
      0.05 * HEIGHT,
      "title_professor"
    );
    this.titlePreventsSprite = this.add.sprite(
      0.34 * WIDTH,
      0.1 * HEIGHT,
      "title_prevents"
    );

    // Characters
    this.professorSprite = this.add.sprite(
      0.03 * WIDTH,
      0.37 * HEIGHT,
      "professor_1"
    );

    // Buttons
    this.playButton = this.add.button(
      0.3 * WIDTH,
      0.68 * HEIGHT,
      "button_play",
      this.playButtonActions.onClick,
      this,
      0,
      0,
      1
    );
    this.playButton.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.playButton.scale)
      .to({ x: 1.1, y: 1.1 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    // Enter Key Icon
    var playHint = this.add.sprite(0, this.playButton.height * 0.65, "icon_enter");
    playHint.anchor.set(0.0, 1.0);
    playHint.scale.setTo(0.5);
    playHint.isHint = true; // Mark as hint (Used to toggle visibility)
    this.playButton.addChild(playHint);

    // Keyboard ADA Access for play button (Enter Key)  
    this.enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    // Press-and-hold visual (downFrame)
    this.enterKey.onDown.add(function () {
      if (this.playButton && this.playButton.events && this.playButton.events.onInputDown) {
        this.playButton.events.onInputDown.dispatch(this.playButton);
      }
    }, this);
    // Release, trigger normal click flow (callback fires on inputUp)
    this.enterKey.onUp.add(function () {
      if (this.playButton && this.playButton.events && this.playButton.events.onInputUp) {
        this.playButton.events.onInputUp.dispatch(this.playButton);
      }
      if (this.nextButton && typeof this.nextButton._upFrame !== 'undefined') {
        this.nextButton.frame = this.nextButton._upFrame;
      }
    }, this);

    // Mute button (ADA keyboard accessible with 'M' key)
    this.muteButton = createMuteButton(this);   // or createMuteButtonPos(this, x, y)
    // Bind 'M' for THIS scene (down = pressed look, up = toggle + reset)
    this.input.keyboard.addKeyCapture([Phaser.Keyboard.M]);    // optional but nice
    this.muteKey = this.input.keyboard.addKey(Phaser.Keyboard.M);

    this.muteKey.onDown.add(function () {
      if (this.muteButton && this.muteButton.events && this.muteButton.events.onInputDown) {
       this.muteButton.events.onInputDown.dispatch(this.muteButton);  // pressed frame
      }
    }, this);

    this.muteKey.onUp.add(function () {
      if (this.muteButton && this.muteButton.events && this.muteButton.events.onInputUp) {
        this.muteButton.events.onInputUp.dispatch(this.muteButton);    // toggle + frame reset
      } else if (window.AudioManager && typeof AudioManager.toggleMusic === 'function') {
        AudioManager.toggleMusic(this);  // fallback if a scene doesn’t draw a button
      }
    }, this);

    // Mute Key Icon
    var muteHint = this.add.sprite(0, this.muteButton.height * 0.65, "icon_m");
    muteHint.anchor.set(0.1, 0.-0.3);
    muteHint.scale.setTo(0.5);
    muteHint.isHint = true; // Mark as hint (Used to toggle visibility)
    this.muteButton.addChild(muteHint);

    // Audio
    AudioManager.playSong("title_music", this);

    // TAB toggle (show/hide hints)
    this.showHints = true;
    this.input.keyboard.addKeyCapture([Phaser.Keyboard.TAB]);
    this.tabKey = this.input.keyboard.addKey(Phaser.Keyboard.TAB);
    this.tabKey.onUp.add(function () {
      this.showHints = !this.showHints;
      this.toggleHints(this.showHints);
    }, this);

  },
  update: function () {
    updateCloudSprites(this);
  },
  playButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("IntroState");
    },
  },

  toggleHints: function (show) {
    // Toggle hints under known buttons in this scene
    this._setHintsOn(this.playButton, show);
    this._setHintsOn(this.muteButton, show);
  },

  _setHintsOn: function (button, show) {
    if (!button || !button.children) return;
    for (var i = 0; i < button.children.length; i++) {
      var c = button.children[i];
      if (c && c.isHint) c.visible = show;
    }
  },

  // Good practice, cleans up onDown/onUp handlers for M key
  shutdown: function () {
    if (this.muteKey) {
      this.muteKey.onDown.removeAll(this);
      this.muteKey.onUp.removeAll(this);
      this.muteKey = null;
    }
    if (this.tabKey) {
      this.tabKey.onUp.removeAll(this);
      this.tabKey = null;
    }
  }

};
