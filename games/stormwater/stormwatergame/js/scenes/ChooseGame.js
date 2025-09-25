"use strict";

var ChooseGameState = {
  preload: function () {},
  create: function () {
    // Background
    this.backgroundSprite = this.add.sprite(0, 0, "background_1");

    // Clouds
    this.cloudSprites = createCloudSprites(this);

    // Characters
    this.professorSprite1 = this.add.sprite(
      0.37 * WIDTH,
      0.41 * HEIGHT,
      "professor_2"
    );

    // Speech Boxes
    this.speechBox1 = this.add.sprite(
      0.2 * WIDTH,
      0.66 * HEIGHT,
      "speechbox_3"
    );
    this.speechBox1.anchor.setTo(0.44, 0.5);

    // Speech Text
    this.speechText1 = this.add.text(
      0.2 * WIDTH + 0.5,
      0.66 * HEIGHT + 0.5,
      TextData.chooseGame,
      TextStyle.centered
    );
    this.speechText1.anchor.setTo(0.5, 0.5);
    this.speechText1.lineSpacing = TextStyle.lineSpacing;
    this.speechText1.resolution = 2;

    // Buttons
    this.ffButton = this.add.button(
      0.25 * WIDTH,
      0.22 * HEIGHT,
      "button_ff",
      this.ffButtonActions.onClick,
      this,
      0,
      0,
      1
    );
    this.ffButton.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.ffButton.scale)
      .to({ x: 0.9, y: 0.9 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    this.ppButton = this.add.button(
      0.75 * WIDTH,
      0.22 * HEIGHT,
      "button_pp",
      this.ppButtonActions.onClick,
      this,
      0,
      0,
      1
    );
    this.ppButton.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.ppButton.scale)
      .to({ x: 0.9, y: 0.9 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    // Keyboard ADA: Left = ff, Right = pp
    this.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
    this.leftKey  = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    // Left arrow (ff)
    this.leftKey.onDown.add(function () {
      var b = this.ffButton;
      if (b && b.visible && b.events && b.events.onInputDown) {
        b.events.onInputDown.dispatch(b); // pressed look
      } else if (typeof b._upFrame !== 'undefined') {
        b.frame = b._upFrame; // fallback reset
      } else if (typeof b._outframe !== 'undefined') {
        b.frame = b._outframe;
      }
    }, this);  

    this.leftKey.onUp.add(function () {
      var b = this.ffButton;
      if (!b) return;
      if (b.events && b.events.onInputUp) {
        b.events.onInputUp.dispatch(b); // triggers click + resets frame
      }
    }, this);

    // Left Arrow key icon (under ff button)
    var ffHint = this.add.sprite(0, this.ffButton.height * 0.65, "icon_left");
    ffHint.anchor.set(0.5, 0.5);
    ffHint.scale.setTo(0.6);
    this.ffButton.addChild(ffHint);

    // Right Arrow (pp)
    this.rightKey.onDown.add(function () {
      var b = this.ppButton;
      if (b && b.visible && b.events && b.events.onInputDown) {
        b.events.onInputDown.dispatch(b); // pressed look
      }
    }, this);

    this.rightKey.onUp.add(function () {
      var b = this.ppButton;
      if (!b) return;
      if (b.events && b.events.onInputUp) {
        b.events.onInputUp.dispatch(b); // triggers click + resets frame
      } else if (typeof b._upFrame !== 'undefined') {
        b.frame = b._upFrame; // fallback reset
      } else if (typeof b._outFrame !== 'undefined') {
        b.frame = b._outFrame;
      }
    }, this);

    // Right Arrow key icon (under pp button)
    var ppHint = this.add.sprite(0, this.ppButton.height * 0.65, "icon_right");
    ppHint.anchor.set(0.5, 0.5);
    ppHint.scale.setTo(0.6);
    this.ppButton.addChild(ppHint);

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
    this.muteButton.addChild(muteHint);

    // Start Animation
    this.animationSpeed = 500;

    this.add
      .tween(this.speechText1.scale)
      .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
    this.add
      .tween(this.speechBox1.scale)
      .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);

    // Audio
    AudioManager.playSong("title_music", this);
  },
  update: function () {
    updateCloudSprites(this);
  },
  ffButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("FFIntroState");
    },
  },
  ppButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("PPIntroState");
    },
  },

  // Good practice, cleans up onDown/onUp handlers for M, LEFT, RIGHT key
  shutdown: function () {
    if (this.muteKey) {
      this.muteKey.onDown.removeAll(this);
      this.muteKey.onUp.removeAll(this);
      this.muteKey = null;
    }
    if (this.leftKey) {
      this.leftKey.onDown.removeAll(this);
      this.leftKey.onUp.removeAll(this);
      this.leftKey = null;
    }
    if (this.rightKey) {
      this.rightKey.onDown.removeAll(this);
      this.rightKey.onUp.removeAll(this);
      this.rightKey = null;
    }
  }
};
