"use strict";

var FFIntroState = {
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
      "professor_6"
    );
    this.professorSprite2.visible = false;

    this.professorSprite3 = this.add.sprite(
      0.4 * WIDTH,
      0.39 * HEIGHT,
      "professor_4"
    );
    this.professorSprite3.visible = false;

    this.professorSprite4 = this.add.sprite(
      0.36 * WIDTH,
      0.42 * HEIGHT,
      "professor_2"
    );
    this.professorSprite4.visible = false;

    // Misc.
    this.houseSprite1 = this.add.sprite(
      0.045 * WIDTH,
      0.38 * HEIGHT,
      "ff_house_1"
    );
    this.houseSprite2 = this.add.sprite(
      0.67 * WIDTH,
      0.38 * HEIGHT,
      "ff_house_2"
    );

    // Speech Boxes
    this.speechBox1 = this.add.sprite(
      0.235 * WIDTH,
      0.345 * HEIGHT,
      "speechbox_1"
    );
    this.speechBox1.anchor.setTo(0.5, 0.5);

    // Speech Text
    this.speechText1 = this.add.text(
      0.215 * WIDTH,
      0.345 * HEIGHT,
      TextData.ffIntro[0],
      TextStyle.centered
    );
    this.speechText1.anchor.setTo(0.5, 0.5);
    this.speechText1.lineSpacing = TextStyle.lineSpacing;
    this.speechText1.resolution = 2;

    this.speechText2 = this.add.text(
      0.215 * WIDTH,
      0.345 * HEIGHT,
      TextData.ffIntro[1],
      TextStyle.centered
    );
    this.speechText2.anchor.setTo(0.5, 0.5);
    this.speechText2.lineSpacing = TextStyle.lineSpacing;
    this.speechText2.visible = false;
    this.speechText2.resolution = 2;

    this.speechText3 = this.add.text(
      0.215 * WIDTH,
      0.345 * HEIGHT,
      TextData.ffIntro[2],
      TextStyle.centered
    );
    this.speechText3.anchor.setTo(0.5, 0.5);
    this.speechText3.lineSpacing = TextStyle.lineSpacing;
    this.speechText3.addFontWeight("bold", 52);
    this.speechText3.addFontWeight("normal", 61);
    this.speechText3.visible = false;
    this.speechText3.resolution = 2;

    this.speechText4 = this.add.text(
      0.215 * WIDTH,
      0.345 * HEIGHT,
      TextData.ffIntro[3],
      TextStyle.centered
    );
    this.speechText4.anchor.setTo(0.5, 0.5);
    this.speechText4.lineSpacing = TextStyle.lineSpacing;
    this.speechText4.visible = false;
    this.speechText4.resolution = 2;

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

    // Mute button
    createMuteButton(this);

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
    
    // Enter Key Icon
    var nextHint = this.add.sprite(0, this.nextButton.height * 0.65, "icon_enter");
    nextHint.anchor.set(0.0, 1.0);
    nextHint.scale.setTo(0.5);
    nextHint.isHint = true; // Mark as hint (Used to toggle visibility)
    this.nextButton.addChild(nextHint);

    //Keyboard: ENTER for Next
    this.input.keyboard.addKeyCapture([Phaser.Keyboard.ENTER, Phaser.Keyboard.M, Phaser.Keyboard.TAB]);

    this.enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    this.enterKey.onDown.add(function () {
      if (this.nextButton && this.nextButton.events && this.nextButton.events.onInputDown) {
        this.nextButton.events.onInputDown.dispatch(this.nextButton);   // pressed look
      }
    }, this);
    this.enterKey.onUp.add(function () {
      if (this.nextButton && this.nextButton.events && this.nextButton.events.onInputUp) {
        this.nextButton.events.onInputUp.dispatch(this.nextButton);     // normal click + reset
      }
    }, this);

    // Mute button + 'M' key
    this.muteButton = createMuteButton(this);   // or createMuteButtonPos(this, x, y)
    this.muteKey = this.input.keyboard.addKey(Phaser.Keyboard.M);
    this.muteKey.onDown.add(function () {
      if (this.muteButton && this.muteButton.events && this.muteButton.events.onInputDown) {
        this.muteButton.events.onInputDown.dispatch(this.muteButton);
      }
    }, this);
    this.muteKey.onUp.add(function () {
      if (this.muteButton && this.muteButton.events && this.muteButton.events.onInputUp) {
        this.muteButton.events.onInputUp.dispatch(this.muteButton);     // toggle + frame reset
      } else if (window.AudioManager && typeof AudioManager.toggleMusic === 'function') {
        AudioManager.toggleMusic(this);                                  // fallback
      }
    }, this);

    // Mute Key Icon
    var muteHint = this.add.sprite(0, this.muteButton.height * 0.65, "icon_m");
    muteHint.anchor.set(0.1, 0.-0.3);
    muteHint.scale.setTo(0.5);
    muteHint.isHint = true; // Mark as hint (Used to toggle visibility)
    this.muteButton.addChild(muteHint);

    // TAB to show/hide hints (uses in-memory flag so it resets on refresh)
    this.tabKey = this.input.keyboard.addKey(Phaser.Keyboard.TAB);
    this.tabKey.onUp.add(function () {
      this.showHints = !this.showHints;
      this.game.showHints = this.showHints;     // persist across scenes while app is open
      this.toggleHints(this.showHints);
    }, this);

    // Apply initial visibility from global flag (default true)
    this.showHints = (typeof this.game.showHints === 'boolean') ? this.game.showHints : true;
    this.toggleHints(this.showHints);

    // Show Tab Hint
    this.tabHint = addTabHint(this.game);

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
      case 3:
        this.professorSprite4.visible = false;
        this.speechText4.visible = false;

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

        this.add
          .tween(this.speechText2.scale)
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
        this.professorSprite4.visible = true;
        this.speechText4.visible = true;

        this.add
          .tween(this.speechText4.scale)
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
      case 4:
        this.state.start("FFGameState");
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

  shutdown: function () {
    if (this.enterKey) { this.enterKey.onDown.removeAll(this); this.enterKey.onUp.removeAll(this); this.enterKey = null; }
    if (this.muteKey)  { this.muteKey.onDown.removeAll(this);  this.muteKey.onUp.removeAll(this);  this.muteKey = null; }
    if (this.tabKey)   { this.tabKey.onUp.removeAll(this);     this.tabKey = null; }
  }

};
