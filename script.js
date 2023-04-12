printMatrix2D = matrix => {
  console.log("2d: \n" + 
    matrix.a + " " + matrix.c + " " + matrix.e + "\n" + 
    matrix.b + " " + matrix.d + " " + matrix.f + "\n"
  );
}

printMatrix3D = matrix => {
  console.log("3d: \n" + 
    matrix.m11 + " " + matrix.m21 + " " + matrix.m31 + " " + matrix.m41 + "\n" + 
    matrix.m12 + " " + matrix.m22 + " " + matrix.m32 + " " + matrix.m42 + "\n" + 
    matrix.m13 + " " + matrix.m23 + " " + matrix.m33 + " " + matrix.m43 + "\n" + 
    matrix.m14 + " " + matrix.m24 + " " + matrix.m34 + " " + matrix.m44 + "\n"
  );
}

class Cubie {
  constructor(positions, matrix, type, name) {
    this.positions = positions;
    this.matrix = matrix;
    this.type = type;
    this.name = name;
  }
  update(tx, ty, tz) {
    this.x = tx;
    this.y = ty;
    this.z = tz;
  }
}

let side = 10;
let index = 0;
let RubikCube = [];

for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      let type = "";
      let counts = {};

      [x, y, z].forEach(t => counts[t] = (counts[t] || 0) + 1 );

      switch ( counts["0"] ) {
        case 3: type = "core"; break;
        case 2: type = "center"; break;
        case 1: type = "edge"; break;
        default: type = "corner";
      }

      let name = "";
      name += (y > 0) ? "U" : (y < 0) ? "D" : "";
      name += (z > 0) ? "F" : (z < 0) ? "B" : "";
      name += (x > 0) ? "R" : (x < 0) ? "L" : "";
      name = (name == "") ? "core" : name;

      let matrix = new DOMMatrix();
      matrix = matrix.translate(x, y, z);

      // console.log(x + " " + y + " " + z);
      // printMatrix2D(matrix);
      // printMatrix3D(matrix);
      // console.log("---------");

      RubikCube[index] = new Cubie({x: x, y: y, z: z}, matrix, type, name);
      index++;
    }
  }
}

function turnZ() {
  for (let i = 0; i < RubikCube.length; i++) {
    let cubie = RubikCube[i];
    if ( cubie.positions.z == 1 ) {
      // console.log("x: " + cubie.positions.x + ", y: " + cubie.positions.y);

      let matrix = new DOMMatrix();
      matrix = matrix.rotate(90);
      matrix = matrix.translate(cubie.positions.x, cubie.positions.y);

      printMatrix2D(matrix);
      cubie.update(matrix.e, matrix.f, cubie.positions.z);

      // console.log("--------------------------------------");
    }
  }
}

// console.log(RubikCube);

turnZ();