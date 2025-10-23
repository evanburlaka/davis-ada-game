"use strict";

var PPLevelSelectState = {
  preload: function () {},
  create: function () {
    // Set Restart Point
    RestartState = "PPLevelSelectState";

    // Background
    this.backgroundSprite = this.add.sprite(0, 0, "background_1");

    // Clouds
    this.cloudSprites = createCloudSprites(this);

    // Mute Button
    //this.muteBtn = this.add.button(0.9 * WIDTH, 0.1 * HEIGHT, "button_sound")

    // Characters
    this.professorSprite = this.add.sprite(
      0.12 * WIDTH,
      0.375 * HEIGHT,
      "professor_6"
    );

    // Title
    //this.title = this.add.sprite((0.5 * WIDTH) -

    // Speech Boxes
    this.speechBox = this.add.sprite(
      0.49 * WIDTH,
      0.35 * HEIGHT,
      "speechbox_3"
    );
    this.speechBox.anchor.setTo(0.44, 0.5);
    this.speechBox.scale.setTo(-1, -1);

    // Speech Text
    this.speechText = this.add.text(
      0.49 * WIDTH + 0.5,
      0.35 * HEIGHT + 0.5,
      TextData.ppChoseLevel,
      TextStyle.centeredExtraLarge
    );
    this.speechText.anchor.setTo(0.5, 0.5);
    this.speechText.lineSpacing = TextStyle.lineSpacing;
    this.speechText.resolution = 2;

    // Level Select Buttons
    this.level1Btn = this.add.button(
      0.475 * WIDTH,
      0.55 * HEIGHT,
      "button_pp_lvl1",
      this.buttonActions.onClickOne,
      this,
      0,
      0,
      1
    );
    this.level1Btn.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.level1Btn.scale)
      .to({ x: 0.9, y: 0.9 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    this.level2Btn = this.add.button(
      0.655 * WIDTH,
      0.55 * HEIGHT,
      "button_pp_lvl2",
      this.buttonActions.onClickTwo,
      this,
      0,
      0,
      1
    );
    this.level2Btn.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.level2Btn.scale)
      .to({ x: 0.9, y: 0.9 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    this.level3Btn = this.add.button(
      0.835 * WIDTH,
      0.55 * HEIGHT,
      "button_pp_lvl3",
      this.buttonActions.onClickThree,
      this,
      0,
      0,
      1
    );
    this.level3Btn.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.level3Btn.scale)
      .to({ x: 0.9, y: 0.9 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    // Start Animation
    this.animationSpeed = 500;

    this.add
      .tween(this.speechText.scale)
      .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
    this.add
      .tween(this.speechBox.scale)
      .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);

    // Audio (if reset)
    AudioManager.playSong("title_music", this);

    // Keyboard: 1 / 2 / 3 for level select, plus Tab toggle, consistent with other scenes
    this.input.keyboard.addKeyCapture([
      Phaser.Keyboard.ONE, Phaser.Keyboard.TWO, Phaser.Keyboard.THREE,
      Phaser.Keyboard.M, Phaser.Keyboard.TAB
    ]);

    // Helper: bind a key to a button's down/up so you get the pressed animation + normal click
    function bindKeyToButton(scene, keyCode, buttonProp) {
      var key = scene.input.keyboard.addKey(keyCode);

      key.onDown.add(function () {
        var b = scene[buttonProp];
        if (b && b.events && b.events.onInputDown) b.events.onInputDown.dispatch(b);
      }, scene);

      key.onUp.add(function () {
        var b = scene[buttonProp];
        if (b && b.events && b.events.onInputUp) b.events.onInputUp.dispatch(b);
      }, scene);

      return key;
    }

    // Bind 1/2/3 to level1/2/3
    this.oneKey   = bindKeyToButton(this, Phaser.Keyboard.ONE,   "level1Btn");
    this.twoKey   = bindKeyToButton(this, Phaser.Keyboard.TWO,   "level2Btn");
    this.threeKey = bindKeyToButton(this, Phaser.Keyboard.THREE, "level3Btn");

    // Hint icons under each level button (1/2/3)
    function addHint(scene, parentBtn, texKey, yFactor, scale) {
      if (!parentBtn) return null;
      var s = scene.add.sprite(0, parentBtn.height * 0.65, texKey);
      s.anchor.set(0.5, 0.1);
      s.scale.setTo(0.5);
      s.isHint = true;            // lets toggleHints() find it
      parentBtn.addChild(s);
      return s;
    }
    addHint(this, this.level1Btn, "icon_1");
    addHint(this, this.level2Btn, "icon_2");
    addHint(this, this.level3Btn, "icon_3");

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

    // TAB toggle (show/hide hints)
    // Read from global (non-persistent) flag and apply
    this.showHints = (typeof this.game.showHints === 'boolean') ? this.game.showHints : true;
    this.toggleHints(this.showHints);
    this.input.keyboard.addKeyCapture([Phaser.Keyboard.TAB]);
    this.tabKey = this.input.keyboard.addKey(Phaser.Keyboard.TAB);
    this.tabKey.onUp.add(function () {
      this.showHints = !this.showHints;
      this.game.showHints = this.showHints;   // persist across scenes (not across reload)
      this.toggleHints(this.showHints);
    }, this);

    // Show Tab Hint
    this.tabHint = addTabHint(this.game);
  },
  update: function () {
    updateCloudSprites(this);
  },
  buttonActions: {
    onClickOne: function () {
      PPGame.levelId = 0;
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("PPQuestionState");
    },
    onClickTwo: function () {
      PPGame.levelId = 1;
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("PPQuestionState");
    },
    onClickThree: function () {
      PPGame.levelId = 2;
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("PPQuestionState");
    },
  },

  toggleHints: function (show) {
    // Toggle hints under known buttons in this scene
    this._setHintsOn(this.muteButton, show);
    this._setHintsOn(this.level1Btn, show);
    this._setHintsOn(this.level2Btn, show);
    this._setHintsOn(this.level3Btn, show);
  },

  _setHintsOn: function (button, show) {
    if (!button || !button.children) return;
    for (var i = 0; i < button.children.length; i++) {
      var c = button.children[i];
      if (c && c.isHint) c.visible = show;
    }
  },

  // Good practice, cleans up handlers keys
  shutdown: function () {
    if (this.oneKey)   { this.oneKey.onDown.removeAll(this);   this.oneKey.onUp.removeAll(this);   this.oneKey = null; }
    if (this.twoKey)   { this.twoKey.onDown.removeAll(this);   this.twoKey.onUp.removeAll(this);   this.twoKey = null; }
    if (this.threeKey) { this.threeKey.onDown.removeAll(this); this.threeKey.onUp.removeAll(this); this.threeKey = null; }
    if (this.muteKey)  { this.muteKey.onDown.removeAll(this);  this.muteKey.onUp.removeAll(this);  this.muteKey = null; }
    if (this.tabKey)   { this.tabKey.onUp.removeAll(this);     this.tabKey = null; }
    if (this.tabHint)  { this.tabHint.destroy(true); this.tabHint = null; }
  }
};
