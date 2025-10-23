"use strict";

var PPScoreState = {
  preload: function () {},
  create: function () {
    this.subSceneIndex = 0;

    // Background
    this.backgroundSprite = this.add.sprite(0, 0, "background_1");

    // Clouds
    this.cloudSprites = createCloudSprites(this);

    // Characters
    this.professorSprite1 = this.add.sprite(
      0.6 * WIDTH,
      0.39 * HEIGHT,
      "professor_3"
    );

    // Title
    this.titleSprite = this.add.sprite(
      0.5 * WIDTH,
      0.2 * HEIGHT,
      "pp_score_title"
    );
    this.titleSprite.anchor.setTo(0.5, 0.5);

    // Speech Box
    this.speechBox = this.add.sprite(0.32 * WIDTH, 0.5 * HEIGHT, "speechbox_5");
    this.speechBox.anchor.setTo(0.44, 0.5);

    // Score
    this.scoreText = this.add.text(
      0.32 * WIDTH,
      0.5 * HEIGHT,
      PPGameData.finalScore(PPGame.score),
      TextStyle.centeredExtraLarge
    );
    this.scoreText.anchor.setTo(0.5, 0.5);
    this.scoreText.lineSpacing = TextStyle.lineSpacing;
    this.scoreText.addFontWeight("bold", 0);
    this.scoreText.addFontWeight("normal", 11);
    this.scoreText.resolution = 2;

    // Buttons
    this.homeButton = this.add.button(
      0.2 * WIDTH,
      0.78 * HEIGHT,
      "button_home",
      this.homeButtonActions.onClick,
      this,
      0,
      0,
      1
    );
    this.homeButton.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.homeButton.scale)
      .to({ x: 1.1, y: 1.1 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    this.replayButton = this.add.button(
      0.4 * WIDTH,
      0.78 * HEIGHT,
      "button_replay",
      this.replayButtonActions.onClick,
      this,
      0,
      0,
      1
    );
    this.replayButton.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.replayButton.scale)
      .to({ x: 1.1, y: 1.1 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

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
    
    // Start Animation
    this.animationSpeed = 500;

    this.add
      .tween(this.scoreText.scale)
      .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
    this.add
      .tween(this.speechBox.scale)
      .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);

    // Reset PPGame
    PPGame.reset();

    // Audio
    AudioManager.playSong("results_music", this);

    // Hint icons under each Pause button
    function addHint(parentBtn, texKey, yFactor, scale) {
      if (!parentBtn) return;
      var s = this.add.sprite(0, parentBtn.height * 0.65, texKey);
      s.anchor.set(0, 1.0);
      s.scale.setTo(0.5);
      s.isHint = true;                 // mark so toggleHints() can find it
      parentBtn.addChild(s);
    }
    addHint.call(this, this.replayButton, "icon_r");     // R under Replay
    addHint.call(this, this.homeButton,    "icon_h");     // H under Home

    // Tab to show/hide all hint icons in this scene
    this.input.keyboard.addKeyCapture([Phaser.Keyboard.TAB]);
    this.tabKey = this.input.keyboard.addKey(Phaser.Keyboard.TAB);
    this.tabKey.onUp.add(function () {
      this.showHints = !this.showHints;
      this.game.showHints = this.showHints;   // persist across scenes (not across refresh)
      this.toggleHints(this.showHints);
    }, this);
    // Read global (non-persistent) preference and apply now
    this.showHints = (typeof this.game.showHints === 'boolean') ? this.game.showHints : true;
    this.toggleHints(this.showHints);

    // Keyboard Accessibility for pause overlay
    // Capture keys so the browser doesn't hijack them
    this.input.keyboard.addKeyCapture([
      Phaser.Keyboard.R,
      Phaser.Keyboard.H,
      Phaser.Keyboard.M
    ]);

    // R - Replay
    this.rKey = this.input.keyboard.addKey(Phaser.Keyboard.R);
    this.rKey.onDown.add(function () {
      var b = this.replayButton;
      if (b && b.events && b.events.onInputDown) b.events.onInputDown.dispatch(b);
    }, this);
    this.rKey.onUp.add(function () {
      var b = this.replayButton;
      if (b && b.events && b.events.onInputUp) b.events.onInputUp.dispatch(b);
    }, this);

    // H - Home
    this.hKey = this.input.keyboard.addKey(Phaser.Keyboard.H);
    this.hKey.onDown.add(function () {
      var b = this.homeButton;
      if (b && b.events && b.events.onInputDown) b.events.onInputDown.dispatch(b);
    }, this);
    this.hKey.onUp.add(function () {
      var b = this.homeButton;
      if (b && b.events && b.events.onInputUp) b.events.onInputUp.dispatch(b);
    }, this);

    // Show Tab Hint
    this.tabHint = addTabHint(this.game);
  },
  update: function () {
    updateCloudSprites(this);
  },
  homeButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("ChooseGameState");
    },
  },
  replayButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("PPLevelSelectState");
    },
  },

  toggleHints: function (show) {
    this._setHintsOn(this.replayButton, show);
    this._setHintsOn(this.homeButton,    show);
    this._setHintsOn(this.muteButton,    show);
  },
  _setHintsOn: function (button, show) {
    if (!button || !button.children) return;
    for (var i = 0; i < button.children.length; i++) {
      var c = button.children[i];
      if (c && c.isHint) c.visible = show;
    }
  },

  shutdown: function () { // cleanup
    if (this.rKey)     { this.rKey.onDown.removeAll(this);     this.rKey.onUp.removeAll(this);     this.rKey = null; }
    if (this.hKey)     { this.hKey.onDown.removeAll(this);     this.hKey.onUp.removeAll(this);     this.hKey = null; }
    if (this.mKey)     { this.mKey.onDown.removeAll(this);     this.mKey.onUp.removeAll(this);     this.mKey = null; }
    if (this.tabKey) {
    this.tabKey.onUp.removeAll(this);
    this.tabKey = null;
    }
  }
};
