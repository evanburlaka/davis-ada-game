"use strict";

var IntroState = {
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
      0.39 * HEIGHT,
      "professor_2"
    );

    this.professorSprite2 = this.add.sprite(
      0.4 * WIDTH,
      0.39 * HEIGHT,
      "professor_3"
    );
    this.professorSprite2.visible = false;

    this.professorSprite3 = this.add.sprite(
      0.42 * WIDTH,
      0.39 * HEIGHT,
      "professor_4"
    );
    this.professorSprite3.visible = false;

    this.professorSprite4 = this.add.sprite(
      0.42 * WIDTH,
      0.4 * HEIGHT,
      "professor_5"
    );
    this.professorSprite4.visible = false;

    this.professorSprite5 = this.add.sprite(
      0.4 * WIDTH,
      0.39 * HEIGHT,
      "professor_6"
    );
    this.professorSprite5.visible = false;

    // Speech Boxes
    this.speechBox1 = this.add.sprite(
      0.2 * WIDTH,
      0.42 * HEIGHT,
      "speechbox_1"
    );
    this.speechBox1.anchor.setTo(0.44, 0.5);

    this.speechBox2 = this.add.sprite(
      0.2 * WIDTH,
      0.48 * HEIGHT,
      "speechbox_2"
    );
    this.speechBox2.anchor.setTo(0.44, 0.5);
    this.speechBox2.visible = false;

    // Info Boxes
    this.infoBox1 = this.add.sprite(
      0.8 * WIDTH,
      0.18 * HEIGHT,
      "infobox_intro3"
    );
    this.infoBox1.anchor.setTo(0.5, 0.0);
    this.infoBox1.visible = false;

    this.infoBox2 = this.add.sprite(
      0.8 * WIDTH,
      0.23 * HEIGHT,
      "infobox_intro4"
    );
    this.infoBox2.anchor.setTo(0.5, 0.0);
    this.infoBox2.visible = false;

    // Speech Text
    this.speechText1 = this.add.text(
      0.2 * WIDTH,
      0.42 * HEIGHT,
      TextData.intro[0],
      TextStyle.centered
    );
    this.speechText1.anchor.setTo(0.5, 0.5);
    this.speechText1.lineSpacing = TextStyle.lineSpacing;
    this.speechText1.resolution = 2;

    this.speechText2 = this.add.text(
      0.2 * WIDTH,
      0.42 * HEIGHT,
      TextData.intro[1],
      TextStyle.centered
    );
    this.speechText2.anchor.setTo(0.5, 0.5);
    this.speechText2.lineSpacing = TextStyle.lineSpacing;
    this.speechText2.addFontWeight("bold", 0);
    this.speechText2.addFontWeight("normal", 10);
    this.speechText2.visible = false;
    this.speechText2.resolution = 2;

    this.speechText3_1 = this.add.text(
      0.2 * WIDTH,
      0.48 * HEIGHT,
      TextData.intro[2][0],
      TextStyle.centered
    );
    this.speechText3_1.anchor.setTo(0.5, 0.5);
    this.speechText3_1.lineSpacing = TextStyle.lineSpacing;
    this.speechText3_1.addFontWeight("bold", 0);
    this.speechText3_1.addFontWeight("normal", 17);
    this.speechText3_1.addFontWeight("bold", 28);
    this.speechText3_1.addFontWeight("normal", 39);
    this.speechText3_1.visible = false;
    this.speechText3_1.resolution = 2;

    this.speechText3_2 = this.add.text(
      0.8 * WIDTH,
      0.2 * HEIGHT,
      TextData.intro[2][1],
      TextStyle.centered
    );
    this.speechText3_2.anchor.setTo(0.5, 0.0);
    this.speechText3_2.lineSpacing = TextStyle.lineSpacing;
    this.speechText3_2.addFontWeight("bold", 0);
    this.speechText3_2.addFontWeight("normal", 10);
    this.speechText3_2.addFontWeight("bold", 37);
    this.speechText3_2.addFontWeight("normal", 42);
    this.speechText3_2.visible = false;
    this.speechText3_2.resolution = 2;

    this.speechText4_1 = this.add.text(
      0.2 * WIDTH,
      0.48 * HEIGHT,
      TextData.intro[3][0],
      TextStyle.centered
    );
    this.speechText4_1.anchor.setTo(0.5, 0.5);
    this.speechText4_1.lineSpacing = TextStyle.lineSpacing;
    this.speechText4_1.visible = false;
    this.speechText4_1.resolution = 2;

    this.speechText4_2 = this.add.text(
      0.8 * WIDTH,
      0.27 * HEIGHT,
      TextData.intro[3][1],
      TextStyle.centered
    );
    this.speechText4_2.anchor.setTo(0.5, 0.0);
    this.speechText4_2.lineSpacing = TextStyle.lineSpacing;
    this.speechText4_2.visible = false;
    this.speechText4_2.resolution = 2;

    this.speechText5 = this.add.text(
      0.2 * WIDTH,
      0.48 * HEIGHT,
      TextData.intro[4],
      TextStyle.centered
    );
    this.speechText5.anchor.setTo(0.5, 0.5);
    this.speechText5.lineSpacing = TextStyle.lineSpacing;
    this.speechText5.visible = false;
    this.speechText5.resolution = 2;

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
        this.speechBox1.visible = false;
        this.speechText2.visible = false;

        this.nextButton.visible = false;
        break;
      case 2:
        this.professorSprite3.visible = false;
        this.infoBox1.visible = false;
        this.speechText3_1.visible = false;
        this.speechText3_2.visible = false;

        this.nextButton.visible = false;
        break;
      case 3:
        this.professorSprite4.visible = false;
        this.infoBox2.visible = false;
        this.speechText4_1.visible = false;
        this.speechText4_2.visible = false;

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
        this.speechBox2.visible = true;
        this.infoBox1.visible = true;
        this.speechText3_1.visible = true;
        this.speechText3_2.visible = true;

        this.add
          .tween(this.speechBox2.scale)
          .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
        this.add
          .tween(this.infoBox1.scale)
          .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
        this.add
          .tween(this.speechText3_1.scale)
          .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
        this.add
          .tween(this.speechText3_2.scale)
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
        this.infoBox2.visible = true;
        this.speechText4_1.visible = true;
        this.speechText4_2.visible = true;

        this.add
          .tween(this.speechBox2.scale)
          .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
        this.add
          .tween(this.infoBox2.scale)
          .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
        this.add
          .tween(this.speechText4_1.scale)
          .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
        this.add
          .tween(this.speechText4_2.scale)
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
        this.professorSprite5.visible = true;
        this.speechText5.visible = true;

        this.add
          .tween(this.speechBox2.scale)
          .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
        this.add
          .tween(this.speechText5.scale)
          .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);

        this.time.events.add(
          this.nextDelay,
          function () {
            this.nextButton.visible = true;
          },
          this
        );
        break;
      case 5:
        this.state.start("ChooseGameState");
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
