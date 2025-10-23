"use strict";

var PPResultState = {
  preload: function () {},
  create: function () {
    var level = PPGameData.levels[PPGame.levelId];
    var question = level[PPGame.questionId];
    var chosenOption = question.options[PPGame.chosenOptionId];
    var correct = chosenOption.correct;
    var wetlands = chosenOption.wetlands;

    if (!PPGame.scoreLock) {
      PPGame.score += correct ? 1 : 0;
      PPGame.scoreLock = true;
    }

    // Background
    this.backgroundSprite = this.add.sprite(
      0,
      0,
      correct ? "background_3" : "background_4"
    );

    // Wetlands
    var wetlandsX = 0.38 * WIDTH;
    var wetlandsY = 0.52 * HEIGHT;

    // Wetlands Background
    this.wetlandsBGSprite = this.add.sprite(
      wetlandsX,
      wetlandsY,
      "pp_wetlands_background"
    );
    this.wetlandsBGSprite.anchor.setTo(0.5, 0.5);

    // Clouds
    this.wetlandsCloudSprite1 = this.add.sprite(
      wetlandsX - 0.18 * WIDTH,
      wetlandsY - 0.25 * HEIGHT,
      "pp_wetlands_cloud1"
    );
    this.add
      .tween(this.wetlandsCloudSprite1)
      .to({ x: wetlandsX - 0.24 * WIDTH }, 20000, "Sine", true, 0, -1, true);

    this.wetlandsCloudSprite2 = this.add.sprite(
      wetlandsX + 0.06 * WIDTH,
      wetlandsY - 0.22 * HEIGHT,
      "pp_wetlands_cloud2"
    );
    this.add
      .tween(this.wetlandsCloudSprite2)
      .to({ x: wetlandsX - 0.06 * WIDTH }, 15000, "Sine", true, 0, -1, true);

    // Soap
    if (wetlands.soap) {
      this.wetlandsSoapSprite = [];
      for (var i = 0; i < 8; ++i) {
        var offset = (Math.random() * 2.0 - 1.0) * 0.25;
        var scale = Math.random() * 0.6 + 0.4;
        var duration = Math.random() * 6000 + 3000;
        var delay = Math.random() * 2000;
        this.wetlandsSoapSprite.push(
          this.add.sprite(
            wetlandsX - offset * WIDTH,
            wetlandsY - 0.02 * HEIGHT,
            "pp_wetlands_bubble"
          )
        );
        this.wetlandsSoapSprite[i].anchor.setTo(0.5, 1.0);
        this.wetlandsSoapSprite[i].scale.x = 0.0;
        this.wetlandsSoapSprite[i].scale.y = 0.0;
        this.add
          .tween(this.wetlandsSoapSprite[i].scale)
          .to({ x: scale, y: scale }, duration, "Sine", true, 0, -1, false)
          .repeatDelay(delay)
          .start();
      }
    }

    // Water Background
    this.wetlandsWaterSprite = this.add.sprite(
      wetlandsX,
      wetlandsY,
      "pp_wetlands_water"
    );
    this.wetlandsWaterSprite.anchor.setTo(0.5, 0.5);

    // Leaves
    if (wetlands.leaves) {
      this.wetlandsLeavesSprite = this.add.sprite(
        wetlandsX,
        wetlandsY + 0.16 * HEIGHT,
        "pp_wetlands_leaves"
      );
      this.wetlandsLeavesSprite.anchor.setTo(0.5, 0.5);
      this.add
        .tween(this.wetlandsLeavesSprite)
        .to({ x: wetlandsX - 0.003 * WIDTH }, 2000, "Sine", true, 0, -1, true);
    }

    // Fish
    if (wetlands.aliveFish) {
      this.wetlandsFishSprite = this.add.sprite(
        wetlandsX + 0.275 * 0.5 * WIDTH,
        wetlandsY + 0.1 * HEIGHT,
        "pp_wetlands_fish"
      );
      this.wetlandsFishSprite.anchor.setTo(0.5, 0.5);

      this.wetlandsFishMask = this.add.graphics(0, 0);
      this.wetlandsFishMask.beginFill(0xffffff);
      this.wetlandsFishMask.drawRect(
        wetlandsX - 0.3 * WIDTH,
        wetlandsY - 0.253 * HEIGHT,
        0.6 * WIDTH,
        0.56 * HEIGHT
      );
      this.wetlandsFishSprite.mask = this.wetlandsFishMask;

      this.add
        .tween(this.wetlandsFishSprite)
        .to({ angle: -5 }, 4000, "Sine", true, 0, -1, true);
      this.add
        .tween(this.wetlandsFishSprite)
        .to({ y: wetlandsY + 0.11 * HEIGHT }, 4000, "Sine", true, 0, -1, true);

      var lapTime = 25000;
      this.add
        .tween(this.wetlandsFishSprite)
        .to(
          { x: wetlandsX - 0.275 * WIDTH },
          lapTime * 0.75,
          Phaser.Easing.In,
          true,
          0,
          -1,
          false
        );
      var fishFlipDirection = function (self) {
        self.time.events.add(
          lapTime,
          function () {
            self.wetlandsFishSprite.scale.x *= -1.0;
            fishFlipDirection(self);
          },
          self
        );
      };
      this.time.events.add(
        lapTime * 0.75,
        function () {
          this.wetlandsFishSprite.position.x = wetlandsX - 0.275 * WIDTH;
          this.wetlandsFishSprite.scale.x *= -1.0;
          this.add
            .tween(this.wetlandsFishSprite)
            .to(
              { x: wetlandsX + 0.275 * WIDTH },
              lapTime,
              Phaser.Easing.In,
              true,
              0,
              -1,
              true
            );
          fishFlipDirection(this);
        },
        this
      );
    }

    // Dead Fish
    if (wetlands.deadFish) {
      this.wetlandsDeadFishSprite1 = this.add.sprite(
        wetlandsX + 0.15 * WIDTH,
        wetlandsY + 0.05 * HEIGHT,
        "pp_wetlands_deadfish"
      );
      this.wetlandsDeadFishSprite1.anchor.setTo(0.5, 0.5);
      this.wetlandsDeadFishSprite1.scale.x = -1.0;
      this.add
        .tween(this.wetlandsDeadFishSprite1)
        .to({ y: wetlandsY + 0.04 * HEIGHT }, 4000, "Sine", true, 0, -1, true);

      this.wetlandsDeadFishSprite2 = this.add.sprite(
        wetlandsX - 0.08 * WIDTH,
        wetlandsY + 0.11 * HEIGHT,
        "pp_wetlands_deadfish"
      );
      this.wetlandsDeadFishSprite2.anchor.setTo(0.5, 0.5);
      this.add
        .tween(this.wetlandsDeadFishSprite2)
        .to({ y: wetlandsY + 0.12 * HEIGHT }, 4000, "Sine", true, 0, -1, true);
    }

    // Trash
    if (wetlands.trash) {
      this.wetlandsTrashSprite = this.add.sprite(
        wetlandsX - 0.005 * WIDTH,
        wetlandsY + 0.07 * HEIGHT,
        "pp_wetlands_trash"
      );
      this.wetlandsTrashSprite.anchor.setTo(0.5, 0.5);
      this.wetlandsTrashSprite.scale.x = -1.0;
      this.add
        .tween(this.wetlandsTrashSprite)
        .to({ x: wetlandsX - 0.003 * WIDTH }, 2000, "Sine", true, 0, -1, true);
      this.add
        .tween(this.wetlandsTrashSprite)
        .to({ y: wetlandsY + 0.08 * HEIGHT }, 4000, "Sine", true, 0, -1, true);
    }

    // Lilypads
    if (wetlands.lilypad) {
      this.wetlandsLilypadSprite = this.add.sprite(
        wetlandsX - 0.12 * WIDTH,
        wetlandsY + 0.02 * HEIGHT,
        "pp_wetlands_lilypads"
      );
      this.add
        .tween(this.wetlandsLilypadSprite)
        .to({ y: wetlandsY + 0.01 * HEIGHT }, 2000, "Sine", true, 0, -1, true);
    }

    // Mulch
    if (wetlands.mulch) {
      this.wetlandsMulchSprite = this.add.sprite(
        wetlandsX,
        wetlandsY - 0.03 * HEIGHT,
        "pp_wetlands_mulch"
      );
      this.wetlandsMulchSprite.anchor.setTo(0.5, 0.5);
      this.add
        .tween(this.wetlandsMulchSprite)
        .to({ x: wetlandsX - 0.003 * WIDTH }, 2000, "Sine", true, 0, -1, true);
    }

    // Bottle
    if (wetlands.bottle) {
      this.wetlandsBottleSprite = this.add.sprite(
        wetlandsX + 0.12 * WIDTH,
        wetlandsY - 0.035 * HEIGHT,
        "pp_wetlands_bottle"
      );
      this.wetlandsBottleSprite.anchor.setTo(0.5, 0.5);
      this.add
        .tween(this.wetlandsBottleSprite)
        .to({ y: wetlandsY - 0.025 * HEIGHT }, 2000, "Sine", true, 0, -1, true);
    }

    switch (wetlands.overlay) {
      case 1: // Overlay - Mud
        this.wetlandsOverlayMudSprite = this.add.sprite(
          wetlandsX,
          wetlandsY,
          "pp_wetlands_overlay_mud"
        );
        this.wetlandsOverlayMudSprite.anchor.setTo(0.5, 0.5);
        break;
      case 2: // Overlay - Paint
        this.wetlandsOverlayPaintSprite = this.add.sprite(
          wetlandsX,
          wetlandsY,
          "pp_wetlands_overlay_paint"
        );
        this.wetlandsOverlayPaintSprite.anchor.setTo(0.5, 0.5);
        break;
      case 3: // Overlay - Fertilizer
        this.wetlandsOverlayFertilizerSprite = this.add.sprite(
          wetlandsX,
          wetlandsY,
          "pp_wetlands_overlay_fertilizer"
        );
        this.wetlandsOverlayFertilizerSprite.anchor.setTo(0.5, 0.5);
        break;
      case 4: // Overlay - Oil
        this.wetlandsOverlayOilSprite = this.add.sprite(
          wetlandsX,
          wetlandsY,
          "pp_wetlands_overlay_oil"
        );
        this.wetlandsOverlayOilSprite.anchor.setTo(0.5, 0.5);
        break;
      case 5: // Overlay - Mud & Oil - Special
        this.wetlandsOverlayMudSprite = this.add.sprite(
          wetlandsX,
          wetlandsY,
          "pp_wetlands_overlay_mud"
        );
        this.wetlandsOverlayMudSprite.anchor.setTo(0.5, 0.5);
        this.wetlandsOverlayOilSprite = this.add.sprite(
          wetlandsX,
          wetlandsY,
          "pp_wetlands_overlay_oil"
        );
        this.wetlandsOverlayOilSprite.anchor.setTo(0.5, 0.5);
        break;
    }

    // Wetlands Foreground
    this.wetlandsFGSprite = this.add.sprite(
      wetlandsX,
      wetlandsY,
      "pp_wetlands_foreground"
    );
    this.wetlandsFGSprite.anchor.setTo(0.5, 0.5);

    // Characters
    this.professorSprite = this.add.sprite(
      0.79 * WIDTH,
      0.5 * HEIGHT,
      correct ? "professor_3" : "professor_7"
    );

    // Header Text
    this.headerText = this.add.text(
      0.38 * WIDTH,
      0.05 * HEIGHT,
      correct ? PPGameData.resultsHeader[0] : PPGameData.resultsHeader[1],
      TextStyle.centeredHeader
    );
    this.headerText.anchor.setTo(0.5, 0.5);
    this.headerText.addColor("#fff", 0);
    this.headerText.addFontWeight("bold", 0);
    this.headerText.resolution = 2;

    // Upper Text
    this.upperText = this.add.text(
      0.38 * WIDTH,
      0.15 * HEIGHT,
      chosenOption.resultUpperText,
      TextStyle.centeredLarge
    );
    this.upperText.anchor.setTo(0.5, 0.5);
    this.upperText.lineSpacing = TextStyle.lineSpacing;
    this.upperText.addColor("#fff", 0);
    this.upperText.addFontWeight("bold", 0);
    this.upperText.resolution = 2;

    // Speech Boxes
    this.speechBox = this.add.sprite(
      0.38 * WIDTH,
      0.87 * HEIGHT,
      "speechbox_4"
    );
    this.speechBox.anchor.setTo(0.46, 0.5);

    // Lower Text
    this.lowerText = this.add.text(
      0.38 * WIDTH,
      0.87 * HEIGHT,
      chosenOption.resultLowerText,
      TextStyle.centered
    );
    this.lowerText.anchor.setTo(0.5, 0.5);
    this.lowerText.lineSpacing = TextStyle.lineSpacing;
    this.lowerText.addFontWeight("bold", 0);
    this.lowerText.resolution = 2;

    // Buttons
    this.nextButton = this.add.button(
      0.888 * WIDTH,
      0.42 * HEIGHT,
      "button_next",
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

    // Start Animation
    this.nextDelay = 1000;
    this.animationSpeed = 500;

    this.add
      .tween(this.lowerText.scale)
      .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
    this.add
      .tween(this.speechBox.scale)
      .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
    this.time.events.add(
      this.nextDelay,
      function () {
        this.nextButton.visible = true;
      },
      this
    );

    // SFX
    if (correct) {
      AudioManager.playSound("correct_sfx", this);
    } else {
      AudioManager.playSound("wrong_sfx", this);
    }

    // Mute button
    createMuteButton(this);

    // Pause Button
    var onPause = function () {
      AudioManager.playSound("bloop_sfx", this);
      LastState = "PPResultState";
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

    // Enter Key Icon
    var nextHint = this.add.sprite(0, this.nextButton.height * 0.65, "icon_enter");
    nextHint.anchor.set(-0.5, 0.6);
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
      if (PPGame.questionsCompleted < 4) {
        PPGame.questionId = PPGame.questionOrder[++PPGame.questionsCompleted];
        this.state.start("PPQuestionState");
      } else {
        this.state.start("PPScoreState");
      }
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
