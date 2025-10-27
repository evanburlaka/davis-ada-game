"use strict";

var PPIntroState = {
  preload: function () {},
  create: function () {
    this.subSceneIndex = 0;

    // Background
    this.backgroundSprite = this.add.sprite(0, 0, "background_1");

    // Clouds
    this.cloudSprites = createCloudSprites(this);

    // Characters
    this.professorSprite1 = this.add.sprite(
      0.42 * WIDTH,
      0.4 * HEIGHT,
      "professor_5"
    );

    this.professorSprite2 = this.add.sprite(
      0.4 * WIDTH,
      0.39 * HEIGHT,
      "professor_3"
    );
    this.professorSprite2.visible = false;

    this.professorSprite3 = this.add.sprite(
      0.6 * WIDTH,
      0.39 * HEIGHT,
      "professor_4"
    );
    this.professorSprite3.scale.setTo(-1.0, 1.0);
    this.professorSprite3.visible = false;

    // Misc.
    this.trashcanSprite = this.add.sprite(
      0.08 * WIDTH,
      0.43 * HEIGHT,
      "pp_trashcan"
    );

    this.dirtSprite = this.add.sprite(0.23 * WIDTH, 0.75 * HEIGHT, "pp_dirt");

    this.dogSprite = this.add.sprite(0.28 * WIDTH, 0.64 * HEIGHT, "pp_dog");

    this.wetlandsSprite = this.add.sprite(
      0.2 * WIDTH,
      0.48 * HEIGHT,
      "pp_wetlands"
    );
    this.wetlandsSprite.anchor.setTo(0.5, 0.5);
    this.wetlandsSprite.visible = false;

    // Speech Boxes
    this.speechBox1 = this.add.sprite(
      0.82 * WIDTH,
      0.58 * HEIGHT,
      "speechbox_2"
    );
    this.speechBox1.scale.setTo(-1.0, -1.0);
    this.speechBox1.anchor.setTo(0.44, 0.5);

    // Speech Text
    this.speechText1 = this.add.text(
      0.82 * WIDTH,
      0.58 * HEIGHT,
      TextData.ppIntro[0],
      TextStyle.centered
    );
    this.speechText1.anchor.setTo(0.5, 0.5);
    this.speechText1.lineSpacing = TextStyle.lineSpacing;
    this.speechText1.resolution = 2;

    this.speechText2 = this.add.text(
      0.82 * WIDTH,
      0.58 * HEIGHT,
      TextData.ppIntro[1],
      TextStyle.centered
    );
    this.speechText2.anchor.setTo(0.5, 0.5);
    this.speechText2.lineSpacing = TextStyle.lineSpacing;
    this.speechText2.visible = false;
    this.speechText2.resolution = 2;

    this.speechText3 = this.add.text(
      0.82 * WIDTH,
      0.58 * HEIGHT,
      TextData.ppIntro[2],
      TextStyle.centered
    );
    this.speechText3.anchor.setTo(0.5, 0.5);
    this.speechText3.lineSpacing = TextStyle.lineSpacing;
    this.speechText3.visible = false;
    this.speechText3.resolution = 2;

    // Buttons
    this.nextButton = this.add.button(
      0.5 * WIDTH,
      0.2 * HEIGHT,
      "button_play",
      this.nextButtonActions.onClick,
      this,
      0,
      0,
      1
    );
    this.nextButton.anchor.setTo(0.5, 0.5);
    this.nextButton.visible = false;
    this.add
      .tween(this.nextButton.scale)
      .to({ x: 1.1, y: 1.1 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    // Enter Key Icon
    var nextHint = this.add.sprite(0, this.nextButton.height * 0.65, "icon_enter");
    nextHint.anchor.set(0.0, 1.0);
    nextHint.scale.setTo(0.5);
    nextHint.isHint = true; // Mark as hint (Used to toggle visibility)
    this.nextButton.addChild(nextHint);

    // Keyboard ADA Access for 'next' button (Enter Key)  
    this.enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    // Press-and-hold visual (downFrame)
    this.enterKey.onDown.add(function () {
      if (this.nextButton && this.nextButton.events && this.nextButton.events.onInputDown) {
        this.nextButton.events.onInputDown.dispatch(this.nextButton);
      }
    }, this);
    // Release, trigger normal click flow (callback fires on inputUp)
    this.enterKey.onUp.add(function () {
      if (this.nextButton && this.nextButton.events && this.nextButton.events.onInputUp) {
        this.nextButton.events.onInputUp.dispatch(this.nextButton);
      }
    }, this);

    // Start Animation
    this.nextDelay = 1000;
    this.animationSpeed = 500;

    this.add
      .tween(this.speechText1.scale)
      .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
    this.add
      .tween(this.speechBox1.scale)
      .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
    this.time.events.add(
      this.nextDelay,
      function () {
        this.nextButton.visible = true;
      },
      this
    );

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

    try {
      if (window.Narrator && window.Narrator.enabled)
        window.Narrator.speak("Pollution Prevention game starting.");
    } catch(e){}
  },
  update: function () {
    updateCloudSprites(this);
  },
  nextSubScene: function () {
    // This probably isn't the most efficient way of doing this

    // Before changing subscene
    switch (this.subSceneIndex) {
      case 0:
        this.professorSprite1.visible = false;
        this.speechText1.visible = false;
        this.trashcanSprite.visible = false;
        this.dirtSprite.visible = false;
        this.dogSprite.visible = false;

        this.nextButton.visible = false;
        break;
      case 1:
        this.professorSprite2.visible = false;
        this.speechText2.visible = false;

        this.nextButton.visible = false;
        break;
      case 2:
        this.professorSprite3.visible = false;
        this.speechText3.visible = false;

        this.nextButton.visible = false;
        break;
    }

    // Increment subscene
    this.subSceneIndex++;

    // After changing subscene
    switch (this.subSceneIndex) {
      case 1:
        this.professorSprite2.visible = true;
        this.speechText2.visible = true;
        this.wetlandsSprite.visible = true;

        this.add
          .tween(this.speechText2.scale)
          .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
        this.add
          .tween(this.speechBox1.scale)
          .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
        this.add
          .tween(this.wetlandsSprite.scale)
          .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);

        this.time.events.add(
          this.nextDelay,
          function () {
            this.nextButton.visible = true;
          },
          this
        );
        break;
      case 2:
        this.professorSprite3.visible = true;
        this.speechText3.visible = true;

        this.add
          .tween(this.speechText3.scale)
          .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
        this.add
          .tween(this.speechBox1.scale)
          .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);

        this.time.events.add(
          this.nextDelay,
          function () {
            this.nextButton.visible = true;
          },
          this
        );
        break;
      case 3:
        this.state.start("PPLevelSelectState");
        break;
    }
  },
  nextButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      this.nextSubScene();
    },
  },

  toggleHints: function (show) {
    // Toggle hints under known buttons in this scene
    this._setHintsOn(this.nextButton, show);
    this._setHintsOn(this.muteButton, show);
  },

  _setHintsOn: function (button, show) {
    if (!button || !button.children) return;
    for (var i = 0; i < button.children.length; i++) {
      var c = button.children[i];
      if (c && c.isHint) c.visible = show;
    }
  },

  // Good practice, cleans up onDown/onUp handlers for M, and ENTER key
  shutdown: function () {
    if (this.muteKey) {
      this.muteKey.onDown.removeAll(this);
      this.muteKey.onUp.removeAll(this);
      this.muteKey = null;
    }
    if (this.enterKey) {
      this.enterKey.onDown.removeAll(this);
      this.enterKey.onUp.removeAll(this);
      this.enterKey = null;
    }
    if (this.tabKey) {
      this.tabKey.onUp.removeAll(this);
      this.tabKey = null;
    }
  }
};
