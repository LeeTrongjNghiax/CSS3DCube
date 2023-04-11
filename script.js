class Cubie {
  constructor(positions, side) {
    this.positions = positions;
    this.side = side;
  }
}

let RubikCube = [];
for (let i = -1; i <= 1; i++) {
  RubikCube[i + 1] = [];
  for (let j = -1; j <= 1; j++) {
    RubikCube[i + 1][j + 1] = [];
    for (let k = -1; k <= 1; k++) {
      RubikCube[i + 1][j + 1][k + 1] = new Cubie({x: i, y: j, z: k}, 10);
      console.log("x: " + i + ", y: " + j + ", z: " + k)
    }
  }
}

console.table(RubikCube);