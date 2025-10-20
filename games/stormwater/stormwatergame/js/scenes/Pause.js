"use strict";

var PauseState = {
  preload: function () {},
  create: function () {
    // Background
    this.backgroundSprite = this.add.sprite(0, 0, "background_1");

    // Clouds
    this.cloudSprites = createCloudSprites(this);

    // Characters
    this.professorSprite = this.add.sprite(
      0.08 * WIDTH,
      0.37 * HEIGHT,
      "professor_1"
    );

    // Speech Boxes
    this.speechBox = this.add.sprite(0.5 * WIDTH, 0.25 * HEIGHT, "speechbox_2");
    this.speechBox.anchor.setTo(0.44, 0.5);
    this.speechBox.scale.setTo(-1.0, 1.0);

    // Speech Text
    this.speechText = this.add.text(
      0.5 * WIDTH,
      0.25 * HEIGHT,
      TextData.pause,
      TextStyle.centeredXXLarge
    );
    this.speechText.anchor.setTo(0.5, 0.5);
    this.speechText.lineSpacing = TextStyle.lineSpacing;
    this.speechText.addFontWeight("bold", 0);
    this.speechText.resolution = 2;

    // Buttons
    this.resumeButton = this.add.button(
      0.4 * WIDTH,
      0.52 * HEIGHT,
      "button_play",
      this.resumeButtonActions.onClick,
      this,
      0,
      0,
      1
    );
    this.resumeButton.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.resumeButton.scale)
      .to({ x: 1.1, y: 1.1 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    this.restartButton = this.add.button(
      0.6 * WIDTH,
      0.52 * HEIGHT,
      "button_replay",
      this.restartButtonActions.onClick,
      this,
      0,
      0,
      1
    );
    this.restartButton.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.restartButton.scale)
      .to({ x: 1.1, y: 1.1 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    this.homeButton = this.add.button(
      0.4 * WIDTH,
      0.77 * HEIGHT,
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

    // Mute Button
    this.muteButton = createMuteButtonPos(this, 0.6, 0.77);
    this.muteButton.anchor.setTo(0.5, 0.5);
    this.muteButton.scale.setTo(1.0, 1.0);
    this.add
      .tween(this.muteButton.scale)
      .to({ x: 1.1, y: 1.1 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);
    
    // Hint icons under each Pause button
    function addHint(parentBtn, texKey, yFactor, scale) {
      if (!parentBtn) return;
      var s = this.add.sprite(0, parentBtn.height * 0.65, texKey);
      s.anchor.set(0, 1.0);
      s.scale.setTo(0.5);
      s.isHint = true;                 // mark so toggleHints() can find it
      parentBtn.addChild(s);
    }
    addHint.call(this, this.resumeButton,  "icon_enter"); // Enter under Resume
    addHint.call(this, this.restartButton, "icon_r");     // R under Restart
    addHint.call(this, this.homeButton,    "icon_h");     // H under Home
    addHint.call(this, this.muteButton,    "icon_m");     // M under Mute
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
      Phaser.Keyboard.ENTER,
      Phaser.Keyboard.R,
      Phaser.Keyboard.H,
      Phaser.Keyboard.M
    ]);

    // ENTER - Resume
    this.enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    this.enterKey.onDown.add(function () {
      var b = this.resumeButton;
      if (b && b.events && b.events.onInputDown) b.events.onInputDown.dispatch(b); // pressed look
    }, this);
    this.enterKey.onUp.add(function () {
      var b = this.resumeButton;
      if (b && b.events && b.events.onInputUp) b.events.onInputUp.dispatch(b);     // normal click flow + reset
    }, this);

    // R - Restart
    this.rKey = this.input.keyboard.addKey(Phaser.Keyboard.R);
    this.rKey.onDown.add(function () {
      var b = this.restartButton;
      if (b && b.events && b.events.onInputDown) b.events.onInputDown.dispatch(b);
    }, this);
    this.rKey.onUp.add(function () {
      var b = this.restartButton;
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

    // M - Mute (matches other scenes; falls back to AudioManager if needed)
    this.mKey = this.input.keyboard.addKey(Phaser.Keyboard.M);
    this.mKey.onDown.add(function () {
      var b = this.muteButton;
      if (b && b.events && b.events.onInputDown) b.events.onInputDown.dispatch(b);
    }, this);
    this.mKey.onUp.add(function () {
      var b = this.muteButton;
      if (b && b.events && b.events.onInputUp) {
        b.events.onInputUp.dispatch(b); // toggle + frame reset via existing handler
      } else if (window.AudioManager && typeof AudioManager.toggleMusic === 'function') {
        AudioManager.toggleMusic(this); // fallback if button not present
      }
    }, this);

    // Show Tab Hint
    this.tabHint = addTabHint(this.game);
  },
  update: function () {
    updateCloudSprites(this);
  },
  resumeButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      this.state.start(LastState);
    },
  },
  restartButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      FFGame.reset();
      PPGame.reset();
      this.state.start(RestartState);
    },
  },
  homeButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      FFGame.reset();
      PPGame.reset();
      this.state.start("ChooseGameState");
    },
  },

  toggleHints: function (show) {
    this._setHintsOn(this.resumeButton,  show);
    this._setHintsOn(this.restartButton, show);
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
    if (this.enterKey) { this.enterKey.onDown.removeAll(this); this.enterKey.onUp.removeAll(this); this.enterKey = null; }
    if (this.rKey)     { this.rKey.onDown.removeAll(this);     this.rKey.onUp.removeAll(this);     this.rKey = null; }
    if (this.hKey)     { this.hKey.onDown.removeAll(this);     this.hKey.onUp.removeAll(this);     this.hKey = null; }
    if (this.mKey)     { this.mKey.onDown.removeAll(this);     this.mKey.onUp.removeAll(this);     this.mKey = null; }
    if (this.tabKey) {
    this.tabKey.onUp.removeAll(this);
    this.tabKey = null;
    }
  }
};
