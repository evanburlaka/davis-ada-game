function addTabHint(game) {
  // Create a group for the hint elements
  var group = game.add.group();

  // Text Style (white)
  var style = Object.assign({}, TextStyle.centeredLarge, { fill: "#FFFFFF" });
  // Subtle semi-transparent rounded backdrop
  var bg = game.add.graphics(0, 0);
  bg.beginFill(0x000000, 0.35);              // black @ 35% opacity
  bg.drawRoundedRect(-5, 2.5, 310, 30, 8);    // x, y, width, height, corner radius
  bg.endFill();
  group.add(bg);

  // "Press" text
  var txtLeft  = game.add.text(0, 25, "Press", style);
  txtLeft.anchor.set(0, 0.7);
  txtLeft.scale.setTo(0.9);                   // subtle shrink
  group.add(txtLeft);

  // Tab key icon
  var tabIcon = game.add.sprite(txtLeft.x + txtLeft.width + 8, 25, "icon_tab");
  tabIcon.anchor.set(0.2, 0.67);
  tabIcon.scale.setTo(0.42);
  group.add(tabIcon);
  
  // "to toggle keyboard controls" text
  var txtRight = game.add.text(tabIcon.x + 33, 25, "to toggle keyboard controls", style);
  txtRight.anchor.set(0, 0.7);
  txtRight.scale.setTo(0.9);
  group.add(txtRight);

  // Position bottom-left with small margin
  var margin = 12;
  group.x = game.width - (bg.width + margin); // from right edge
  group.y = game.height - 40;  // 40px from bottom

  return group;
}
