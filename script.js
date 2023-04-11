class Cubie {
  constructor(positions, side, type, name) {
    this.positions = positions;
    this.side = side;
    this.type = type;
    this.name = name;
  }
}

let side = 10;
let RubikCube = [];

for (let i = -1; i <= 1; i++) {
  RubikCube[i + 1] = [];
  for (let j = -1; j <= 1; j++) {
    RubikCube[i + 1][j + 1] = [];
    for (let k = -1; k <= 1; k++) {
      let type = "";
      let counts = {};

      [i, j, k].forEach(x => counts[x] = (counts[x] || 0) + 1 );

      switch ( counts["0"] ) {
        case 3: type = "core"; break;
        case 2: type = "center"; break;
        case 1: type = "edge"; break;
        default: type = "corner";
      }

      let name = "";
      name += (j > 0) ? "U" : (j < 0) ? "D" : "";
      name += (k > 0) ? "F" : (k < 0) ? "B" : "";
      name += (i > 0) ? "R" : (i < 0) ? "L" : "";
      name = (name == "") ? "core" : name;

      RubikCube[i + 1][j + 1][k + 1] = new Cubie({x: i, y: j, z: k}, side, type, name);
      console.log("x: " + i + ", y: " + j + ", z: " + k + ", type: " + type + ", name: " + name);
    }
  }
}

console.table(RubikCube);