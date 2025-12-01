"use strict";

var PPQuestionState = {
  preload: function () { },
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
    this.optionButtons = [];
    this.selectedOptionIndex = 0;

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

      // Add highlight graphics
      var g = this.add.graphics(0, 0);
      g.lineStyle(5, 0x0099FF, 0.8); // Blue, slightly transparent
      // Button size is roughly 212x212 (from PPLevelSelect logic/assets, checking Load.js: button_pp is 212x212)
      // Actually, let's check Load.js again.
      // Load.js line 89: "button_pp", "assets/button/pp.png", 212, 212
      // But wait, the code uses `PPGame.optionOrder[i].obj.name` as the key.
      // In Load.js lines 215-226, options are loaded as images.
      // Let's assume they are roughly square or use the button dimensions if available.
      // Since they are buttons, they use the texture dimensions.
      // Let's try to get width/height from the button itself, but it might not be loaded yet?
      // Phaser 2 buttons usually have width/height immediately if texture is in cache.
      // Let's use a generic size or try to read it.
      // Safe bet: draw a circle or rect based on expected size.
      // The previous code used 212x212 for "button_pp".
      // Let's use a circle for these as they look like bubbles/circles in the game usually?
      // Or just a rect. Let's stick to rect to be safe, or circle if it looks better.
      // The level select buttons were rectangular (152x58).
      // These option buttons seem to be images.
      // Let's use a circle of radius ~100 (diameter 200) as a safe guess, or a rect.
      // Let's use a rounded rect that fits 200x200.
      var w = optionButton.width || 200;
      var h = optionButton.height || 200;
      var pad = 10;
      g.drawRoundedRect(-w / 2 - pad, -h / 2 - pad, w + pad * 2, h + pad * 2, 20);
      g.visible = false;
      g.isSelectionHighlight = true;
      optionButton.addChild(g);

      this.optionButtons.push(optionButton);
    }

    this.updateSelection();

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
    pauseHint.anchor.set(0.1, 0. - 0.3);
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
    muteHint.anchor.set(0.1, 0. - 0.3);
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

    // --- Keyboard Navigation (Arrow Keys) ---
    this.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.ENTER,
    ]);

    this.leftKey = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.leftKey.onDown.add(this.selectPreviousOption, this);

    this.rightKey = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.rightKey.onDown.add(this.selectNextOption, this);

    this.enterKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    this.enterKey.onDown.add(this.confirmSelection, this);

    try {
      if (window.Narrator && window.Narrator.enabled) {
        var count = (PPGame.optionOrder || []).length;
        var msg = "Make a selection.";
        if (count) msg += "There are " + count + " options.";
        window.Narrator.speak(msg);
      }
    } catch (e) { }
  },
  update: function () { },

  selectPreviousOption: function () {
    this.selectedOptionIndex--;
    if (this.selectedOptionIndex < 0) {
      this.selectedOptionIndex = this.optionButtons.length - 1;
    }
    this.updateSelection();
    AudioManager.playSound("bloop_sfx", this);
  },

  selectNextOption: function () {
    this.selectedOptionIndex++;
    if (this.selectedOptionIndex >= this.optionButtons.length) {
      this.selectedOptionIndex = 0;
    }
    this.updateSelection();
    AudioManager.playSound("bloop_sfx", this);
  },

  confirmSelection: function () {
    var btn = this.optionButtons[this.selectedOptionIndex];
    if (btn && btn.events && btn.events.onInputUp) {
      // Simulate a click
      // Note: The original onClick handler uses 'this' as the button (ref) or context?
      // The original onClick is: function (ref) { ... }
      // And it's passed as callback, context=this (scene).
      // When dispatched, the first arg is the button.
      btn.events.onInputUp.dispatch(btn, null, false);
    }
  },

  updateSelection: function () {
    for (var i = 0; i < this.optionButtons.length; i++) {
      var btn = this.optionButtons[i];
      // Find the highlight child
      for (var j = 0; j < btn.children.length; j++) {
        if (btn.children[j].isSelectionHighlight) {
          btn.children[j].visible = i === this.selectedOptionIndex;
        }
      }
    }
  },

  toggleHints: function (show) {
    this._setHintsOn(this.pauseButton, show);
    this._setHintsOn(this.muteButton, show);
    // Also toggle hints on option buttons if we add them later
    for (var i = 0; i < this.optionButtons.length; i++) {
      this._setHintsOn(this.optionButtons[i], show);
    }
  },
  _setHintsOn: function (button, show) {
    if (!button || !button.children) return;
    for (var i = 0; i < button.children.length; i++) {
      var c = button.children[i];
      if (c && c.isHint) c.visible = show;
    }
  },

  shutdown: function () {
    if (this.pKey) { this.pKey.onDown.removeAll(this); this.pKey.onUp.removeAll(this); this.pKey = null; }
    if (this.muteKey) { this.muteKey.onDown.removeAll(this); this.muteKey.onUp.removeAll(this); this.muteKey = null; }
    if (this.tabKey) { this.tabKey.onUp.removeAll(this); this.tabKey = null; }
    if (this.tabHint) { this.tabHint.destroy(true); this.tabHint = null; }
    if (this.leftKey) { this.leftKey.onDown.removeAll(this); this.leftKey = null; }
    if (this.rightKey) { this.rightKey.onDown.removeAll(this); this.rightKey = null; }
    if (this.enterKey) { this.enterKey.onDown.removeAll(this); this.enterKey = null; }
  },
};
