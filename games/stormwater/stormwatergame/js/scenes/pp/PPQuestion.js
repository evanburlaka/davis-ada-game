"use strict";

var PPQuestionState = {
  preload: function () {},
  create: function () {
    var level = PPGameData.levels[PPGame.levelId];
    var question = level[PPGame.questionId];
    var options = question.options;

    // Randomize options
    if (PPGame.optionOrder.length == 0) {
      var randomOptions = [];
      for (var i = 0; i < options.length; ++i) {
        randomOptions.push({
          id: i,
          obj: options[i],
        });
      }
      shuffleArray(randomOptions);
      PPGame.optionOrder = randomOptions;
    }

    // Background
    this.backgroundSprite = this.add.sprite(0, 0, "background_2");

    // Question Text Sprite
    this.questionTextSprite = this.add.sprite(
      0.45 * WIDTH,
      0.1 * HEIGHT,
      "pp_question_text"
    );

    // Question Image Sprite
    this.questionImageSprite = this.add.sprite(0, 0, question.name);

    // Mute button
    createMuteButton(this);

    // Pause Button
    var onPause = function () {
      AudioManager.playSound("bloop_sfx", this);
      LastState = "PPQuestionState";
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

    // Choice Buttons
    var buttonWidth = WIDTH * (options.length == 3 ? 0.33 : 0.42);
    for (var i = 0; i < PPGame.optionOrder.length; ++i) {
      var onClick = function (ref) {
        PPGame.chosenOptionId = ref.optionIndex;
        PPGame.scoreLock = false;
        PPGame.optionOrder = [];
        AudioManager.playSound("bloop_sfx", this);
        this.state.start("PPRainState");
      };
      var xOffset =
        0.5 * WIDTH -
        buttonWidth * (PPGame.optionOrder.length - 1) * 0.5 +
        buttonWidth * i;
      var optionButton = this.add.button(
        xOffset,
        0.68 * HEIGHT,
        PPGame.optionOrder[i].obj.name,
        onClick,
        this,
        0,
        0,
        0
      );
      optionButton.anchor.setTo(0.5, 0.5);
      optionButton.optionIndex = PPGame.optionOrder[i].id;
      this.add
        .tween(optionButton.scale)
        .to({ x: 0.95, y: 0.95 }, 600, "Linear", true)
        .yoyo(true, 0)
        .loop(true);
    }

    // Play music
    AudioManager.playSong("pp_music", this);

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

    try {
      if (window.Narrator && window.Narrator.enabled) {
        var count = (PPGame.optionOrder || []).length;
        var msg = "Make a selection.";
        if (count) msg += "There are " + count + " options.";
        window.Narrator.speak(msg);
      }
    } catch(e){}
  },
  update: function () {},

  toggleHints: function (show) {
    this._setHintsOn(this.pauseButton, show);
    this._setHintsOn(this.muteButton,  show);
  },
  _setHintsOn: function (button, show) {
    if (!button || !button.children) return;
    for (var i = 0; i < button.children.length; i++) {
      var c = button.children[i];
      if (c && c.isHint) c.visible = show;
    }
  },

  shutdown: function () {
    if (this.pKey)    { this.pKey.onDown.removeAll(this);    this.pKey.onUp.removeAll(this);    this.pKey = null; }
    if (this.muteKey) { this.muteKey.onDown.removeAll(this); this.muteKey.onUp.removeAll(this); this.muteKey = null; }
    if (this.tabKey)  { this.tabKey.onUp.removeAll(this);    this.tabKey = null; }
    if (this.tabHint) { this.tabHint.destroy(true); this.tabHint = null; }
  },
};
