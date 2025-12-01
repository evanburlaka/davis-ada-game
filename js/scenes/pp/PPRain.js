"use strict";

var PPRainState = {
  preload: function () {},
  create: function () {
    // Background
    this.backgroundSprite1 = this.add.sprite(0, 0, "background_1");
    this.backgroundSprite2 = this.add.sprite(0, 0, "background_1_1");

    // Clouds
    this.cloudSprite1 = this.add.sprite(
      -0.18 * WIDTH,
      0.02 * HEIGHT,
      "cloud_3"
    );
    this.add
      .tween(this.cloudSprite1)
      .to({ x: -0.02 * WIDTH }, 2000, "Sine", true);

    this.cloudSprite2 = this.add.sprite(0.88 * WIDTH, 0.18 * HEIGHT, "cloud_4");
    this.add
      .tween(this.cloudSprite2)
      .to({ x: 0.7 * WIDTH }, 2000, "Sine", true);

    // Misc.
    this.houseSprite = this.add.sprite(0.08 * WIDTH, 0.45 * HEIGHT, "pp_house");

    // Rain
    this.rainEmitter = this.add.emitter(0.5 * WIDTH, -0.5 * HEIGHT, 200);
    this.rainEmitter.width = 1.5 * WIDTH;
    this.rainEmitter.angle = 20;
    this.rainEmitter.makeParticles("pp_raindrop");
    this.rainEmitter.minParticleScale = 0.8;
    this.rainEmitter.maxParticleScale = 1.0;
    this.rainEmitter.setYSpeed(300, 500);
    this.rainEmitter.setXSpeed(-5, 5);
    this.rainEmitter.minRotation = this.rainEmitter.maxRotation = 0;
    this.rainEmitter.start(false, 1600, 5, 0);

    // Characters
    this.professorSprite1 = this.add.sprite(
      0.37 * WIDTH,
      0.4 * HEIGHT,
      "professor_2"
    );

    // Speech Boxes
    this.speechBox1 = this.add.sprite(
      0.8 * WIDTH,
      0.68 * HEIGHT,
      "speechbox_2"
    );
    this.speechBox1.scale.setTo(-1.0, -1.0);
    this.speechBox1.anchor.setTo(0.44, 0.5);

    // Speech Text
    this.speechText1 = this.add.text(
      0.8 * WIDTH,
      0.68 * HEIGHT,
      TextData.ppRain,
      TextStyle.centeredLarge
    );
    this.speechText1.anchor.setTo(0.5, 0.5);
    this.speechText1.lineSpacing = TextStyle.lineSpacing;
    this.speechText1.resolution = 2;

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

    // Pause Button
    var onPause = function () {
      AudioManager.playSound("bloop_sfx", this);
      LastState = "PPRainState";
      this.state.start("PauseState");
    };
    this.pauseButton = this.add.button(
      0.892 * WIDTH,
      0.185 * HEIGHT,
      "button_pause",
      onPause,
      this,
      0,
      0,
      1
    );
    this.pauseButton.scale.setTo(0.75);

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

    // Play sound
    AudioManager.playSound("rain_sfx", this);

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

    // Keyboard Accessibility for Pause & Mute buttons 
    this.input.keyboard.addKeyCapture([Phaser.Keyboard.P, Phaser.Keyboard.M]);

    // Pause button (P key) 
    this.pKey = this.input.keyboard.addKey(Phaser.Keyboard.P);
    this.pKey.onDown.add(function () {
      if (this.pauseButton && this.pauseButton.events && this.pauseButton.events.onInputDown) {
        this.pauseButton.events.onInputDown.dispatch(this.pauseButton); // show pressed frame
      }
    }, this);
    this.pKey.onUp.add(function () {
      if (this.pauseButton && this.pauseButton.events && this.pauseButton.events.onInputUp) {
        this.pauseButton.events.onInputUp.dispatch(this.pauseButton);   // normal click flow
      }
    }, this);

    // Pause Key Icon
    var pauseHint = this.add.sprite(0, this.pauseButton.height * 0.65, "icon_p");
    pauseHint.anchor.set(0.1, 0.-0.3);
    pauseHint.scale.setTo(0.5);
    pauseHint.isHint = true; // Mark as hint (Used to toggle visibility)
    this.pauseButton.addChild(pauseHint);

    // Mute button (M key)
    this.muteKey = this.input.keyboard.addKey(Phaser.Keyboard.M);
    this.muteKey.onDown.add(function () {
      if (this.muteButton && this.muteButton.events && this.muteButton.events.onInputDown) {
        this.muteButton.events.onInputDown.dispatch(this.muteButton);   // pressed animation
      }
    }, this);
    this.muteKey.onUp.add(function () {
      if (this.muteButton && this.muteButton.events && this.muteButton.events.onInputUp) {
        this.muteButton.events.onInputUp.dispatch(this.muteButton);     // toggle + reset
      } else if (window.AudioManager && typeof AudioManager.toggleMusic === "function") {
        AudioManager.toggleMusic(this);                                 // fallback (if mute not visible)
      }
    }, this);

    // Mute Key Icon
    var muteHint = this.add.sprite(0, this.muteButton.height * 0.65, "icon_m");
    muteHint.anchor.set(0.1, 0.-0.3);
    muteHint.scale.setTo(0.5);
    muteHint.isHint = true; // Mark as hint (Used to toggle visibility)
    this.muteButton.addChild(muteHint);

    // TAB toggle for hint icons (safe + in-memory) 
    this.input.keyboard.addKeyCapture([Phaser.Keyboard.TAB]);
    this.tabKey = this.input.keyboard.addKey(Phaser.Keyboard.TAB);

    this.tabKey.onUp.add(function () {
      this.showHints = !this.showHints;
      this.game.showHints = this.showHints;      // persists across scenes (not across refresh)
      this.toggleHints(this.showHints);
    }, this);

    // Initial visibility from global flag (default true)
    this.showHints = (typeof this.game.showHints === 'boolean') ? this.game.showHints : true;
    this.toggleHints(this.showHints);

    // show bottom-right Tab help only if helper is loaded
    if (typeof addTabHint === 'function') {
      this.tabHint = addTabHint(this.game);
    }
  },
  update: function () {},
  nextButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("PPResultState");
    },
  },

   toggleHints: function (show) {
    // Toggle hints under known buttons in this scene
    this._setHintsOn(this.pauseButton, show);
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
    if (this.pKey)    { this.pKey.onDown.removeAll(this);    this.pKey.onUp.removeAll(this);    this.pKey = null; }
  }
};
