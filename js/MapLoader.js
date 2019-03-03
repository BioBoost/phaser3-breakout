class MapLoader {

  static loadMap(context, map) {
    let blocks = context.physics.add.staticGroup();
    
    let x = 150;
    let y = 150;

    let step = (1280 - 2*x) / 12;    // 12 = number of blocks
    console.log("Step x = " + step);

    let mapData = context.cache.json.get('map-' + map);
    mapData.blocks.forEach(function(row) {
      x = 150;
      row.forEach(function(block) {
        blocks.create(x, y, 'block');
        x += step;
      });
      y += 85;
    });

    return blocks;
  }

};

export default MapLoader;