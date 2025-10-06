function addTabHint(game) {
  // Create a group for the hint elements
  var group = game.add.group();

  // Text Style (white)
  var style = Object.assign({}, TextStyle.centeredLarge, { fill: "#FFFFFF" });
  // Subtle semi-transparent rounded backdrop
  var bg = game.add.graphics(0, 0);
  bg.beginFill(0x000000, 0.35);              // black @ 35% opacity
  bg.drawRoundedRect(-10, -5.5, 360, 34, 8);    // x, y, width, height, corner radius
  bg.endFill();
  group.add(bg);

  // "Press" text
  var txtLeft  = game.add.text(0, 20, "Press", style);
  txtLeft.anchor.set(0, 0.7);
  group.add(txtLeft);

  // Tab key icon
  var tabIcon = game.add.sprite(txtLeft.x + txtLeft.width + 10, 20, "icon_tab");
  tabIcon.anchor.set(0.2, 0.67);
  tabIcon.scale.setTo(0.5);
  group.add(tabIcon);
  
  // "to toggle keyboard controls" text
  var txtRight = game.add.text(tabIcon.x + 40, 20, "to toggle keyboard controls", style);
  txtRight.anchor.set(0, 0.7);
  group.add(txtRight);

  // Position bottom-left with small margin
  var margin = 12;
  group.x = margin;
  group.y = game.height - 40;  // 40px from bottom

  return group;
}
