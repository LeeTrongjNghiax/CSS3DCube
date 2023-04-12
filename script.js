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

class Face {
  constructor(normal, color) {
    this.normal = normal;
    this.color = color;
  }
}

class Cubie {
  constructor(positions, matrix, type, name, faces) {
    this.positions = positions;
    this.matrix = matrix;
    this.type = type;
    this.name = name;
    this.faces = faces;
  }
  update(tx, ty, tz) {
    this.positions.x = tx;
    this.positions.y = ty;
    this.positions.z = tz;
  }
  setMatrix(matrix) {
    this.matrix = matrix;
  }
  getMatrix = () => this.matrix;
}

const side = getComputedStyle(document.body).getPropertyValue('--length').slice(0, -2) / 3;
const faces = ["up", "down", "front", "back", "right", "left"];
const colors = ["white", "yellow", "green", "blue", "red", "orange"];
let RubikCube = [];
let index = 0;

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
      name += (y > 0) ? "D" : (y < 0) ? "U" : "";
      name += (z > 0) ? "F" : (z < 0) ? "B" : "";
      name += (x > 0) ? "R" : (x < 0) ? "L" : "";
      name = (name == "") ? "core" : name;

      let matrix = new DOMMatrix();
      matrix = matrix.translate(x, y, z);

      // console.log(x + " " + y + " " + z);
      // printMatrix2D(matrix);
      // printMatrix3D(matrix);
      // console.log("---------");

      let f = [];

      f.push(
        new Face([0, -1, 0], faces[0]), 
        new Face([0, 1, 0], faces[1]), 
        new Face([0, 0, 1], faces[2]), 
        new Face([0, 0, -1], faces[3]), 
        new Face([1, 0, 0], faces[4]), 
        new Face([-1, 0, 0], faces[5]), 
      );

      RubikCube[index] = new Cubie({x: x, y: y, z: z}, matrix, type, name, f);
      index++;
    }
  }
}

turnZ = () => {
  for (let i = 0; i < RubikCube.length; i++) {
    if ( RubikCube[i].positions.z == 1 ) {
      let matrix = new DOMMatrix();
      matrix = matrix.rotate(90);
      matrix = matrix.translate(RubikCube[i].positions.x, RubikCube[i].positions.y);

      // printMatrix2D(matrix);

      // console.log("Before: x: " + RubikCube[i].positions.x + ", y: " + RubikCube[i].positions.y);
      // printMatrix2D(RubikCube[i].matrix);

      RubikCube[i].update(matrix.e, matrix.f, RubikCube[i].positions.z);

      // console.log("After:  x: " + RubikCube[i].positions.x + ", y: " + RubikCube[i].positions.y);
      // printMatrix2D(RubikCube[i].matrix);
      
      RubikCube[i].setMatrix(matrix);

      // console.log("--------------------------------------");
    }
  }
}

generateRubik = () => {
  let container = document.querySelector("#rubik-cube");

  for (let i = 0; i < RubikCube.length; i++) {
    if (RubikCube[i].positions.z == 1) {
      let con = document.createElement("div");
      con.setAttribute("class", "cubie-container");
      con.setAttribute("id", `${RubikCube[i].name}-container`);

      for (let j = 0; j < 6; j++) {
        let face = document.createElement("div");

        face.classList.add(faces[j], colors[j], "face");
        con.appendChild(face);
      }

      container.appendChild(con);
    }
  }
}

document.querySelector("#move .F").addEventListener("click", () => {
  // alert`wrsghwr`
  turnZ();
})

loop = () => {
  document.querySelector("#x-value").innerHTML = document.querySelector("form #rotate-x").value;
  document.querySelector("#y-value").innerHTML = document.querySelector("form #rotate-y").value;
  document.querySelector("#z-value").innerHTML = document.querySelector("form #rotate-z").value;
  document.querySelector("#perspective-value").innerHTML = document.querySelector("#perspective").value;

  document.querySelector("#rubik-cube").style.transform = `
    translate(-50%, -50%) 
    rotateX(${document.querySelector("form #rotate-x").value}deg) 
    rotateY(${document.querySelector("form #rotate-y").value}deg) 
    rotateZ(${document.querySelector("form #rotate-z").value}deg)
  ` 
  document.querySelector("#rubik-cube").style.perspective = `${document.querySelector("#perspective").value}px`;

  for (let i = 0; i < RubikCube.length; i++) {
    if (RubikCube[i].positions.z == 1) {
      let matrix = new DOMMatrix();
      matrix = matrix.translate(RubikCube[i].positions.x * side, RubikCube[i].positions.y * side, RubikCube[i].positions.z * side);
      document.querySelector(`#${RubikCube[i].name}-container`).style.transform = matrix;
    }
  }

  requestAnimationFrame(loop);
}

generateRubik();

loop();