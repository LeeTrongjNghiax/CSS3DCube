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

degreesToradians = degrees => degrees * ( Math.PI / 180);

class Face {
  constructor(normal, name, color) {
    this.normal = normal;
    this.name = name;
    this.color = color;
  }
  turnZ(angle) {
    let v = JSON.parse( JSON.stringify( this.normal ) );
    this.normal[0] = v[0] * Math.round(Math.cos(angle)) - v[1] * Math.round(Math.sin(angle));
    this.normal[1] = v[0] * Math.round(Math.sin(angle)) + v[1] * Math.round(Math.cos(angle));
    this.normal[2] = v[2];
  }
  turnY(angle) {
    let v = JSON.parse( JSON.stringify( this.normal ) );
    this.normal[0] = v[0] * Math.round(Math.cos(angle)) - v[2] * Math.round(Math.sin(angle));
    this.normal[2] = v[0] * Math.round(Math.sin(angle)) + v[2] * Math.round(Math.cos(angle));
    this.normal[1] = v[1];
  }
  turnX(angle) {
    let v = JSON.parse( JSON.stringify( this.normal ) );
    this.normal[1] = v[1] * Math.round(Math.cos(angle)) - v[2] * Math.round(Math.sin(angle));
    this.normal[2] = v[1] * Math.round(Math.sin(angle)) + v[2] * Math.round(Math.cos(angle));
    this.normal[0] = v[0];
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
  turnFaceY = (dir, angle) => {
    for (let i = 0; i < this.faces.length; i++) {
      this.faces[i].turnY(dir * angle);
    }
  }
  turnFaceZ = (dir, angle) => {
    for (let i = 0; i < this.faces.length; i++) {
      this.faces[i].turnZ(dir * angle);
    }
  }
  turnFaceX = (dir, angle) => {
    for (let i = 0; i < this.faces.length; i++) {
      this.faces[i].turnX(dir * angle);
    }
  }
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
        new Face([0, -1, 0], faces[0], colors[0]), 
        new Face([0, 1, 0], faces[1], colors[1]), 
        new Face([0, 0, 1], faces[2], colors[2]), 
        new Face([0, 0, -1], faces[3], colors[3]), 
        new Face([1, 0, 0], faces[4], colors[4]), 
        new Face([-1, 0, 0], faces[5], colors[5]), 
      );

      RubikCube[index] = new Cubie({x: x, y: y, z: z}, matrix, type, name, f);
      index++;
    }
  }
}

turnY = (index, dir, angle) => {
  for (let i = 0; i < RubikCube.length; i++) {
    if ( RubikCube[i].positions.y == index ) {
      let matrix = new DOMMatrix();
      matrix = matrix.rotate(dir * angle);
      matrix = matrix.translate(RubikCube[i].positions.x, RubikCube[i].positions.z);

      RubikCube[i].update(matrix.m41, RubikCube[i].positions.y, matrix.m42);
      // RubikCube[i].setMatrix(matrix);
      RubikCube[i].turnFaceY(dir, degreesToradians(angle) );
    }
  }
}
turnZ = (index, dir, angle) => {
  for (let i = 0; i < RubikCube.length; i++) {
    if ( RubikCube[i].positions.z == index ) {
      let matrix = new DOMMatrix();
      matrix = matrix.rotate(dir * angle);
      matrix = matrix.translate(RubikCube[i].positions.x, RubikCube[i].positions.y);

      RubikCube[i].update(matrix.m41, matrix.m42, RubikCube[i].positions.z);
      // RubikCube[i].setMatrix(matrix);
      RubikCube[i].turnFaceZ(dir, degreesToradians(angle) );
    }
  }
}
turnX = (index, dir, angle) => {
  for (let i = 0; i < RubikCube.length; i++) {
    if ( RubikCube[i].positions.x == index ) {
      let matrix = new DOMMatrix();
      matrix = matrix.rotate(dir * angle);
      matrix = matrix.translate(RubikCube[i].positions.y, RubikCube[i].positions.z);

      RubikCube[i].update(RubikCube[i].positions.x, matrix.m41, matrix.m42);
      // RubikCube[i].setMatrix(matrix);
      RubikCube[i].turnFaceX(dir, degreesToradians(angle) );
    }
  }
}

generateRubik = () => {
  let container = document.querySelector("#rubik-cube");

  for (let i = 0; i < RubikCube.length; i++) {
    if (
      true
    ) {
      let con = document.createElement("div");
      con.setAttribute("class", "cubie-container");
      con.setAttribute("id", `${RubikCube[i].name}-container`);

      for (let j = 0; j < RubikCube[i].faces.length; j++) {
        let face = document.createElement("div");

        face.classList.add(RubikCube[i].faces[j].name, RubikCube[i].faces[j].color, "face");
        con.appendChild(face);
      }

      container.appendChild(con);
    }
  }
}

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
    if (
      true
    ) {
      let matrix = new DOMMatrix();
      matrix = matrix.translate(
        RubikCube[i].positions.x * side, 
        RubikCube[i].positions.y * side, 
        RubikCube[i].positions.z * side
      );
      document.querySelector(`#${RubikCube[i].name}-container`).style.transform = matrix;

      for (let j = 0; j < RubikCube[i].faces.length; j++) {
        let matrix2 = new DOMMatrix();
        if ( Math.abs(RubikCube[i].faces[j].normal[0]) > 0 ) {
          matrix2 = matrix2.translate(
            RubikCube[i].faces[j].normal[0] * side / -2, 
            RubikCube[i].faces[j].normal[2] * side / 2, 
            Math.abs( RubikCube[i].faces[j].normal[0] * side / 2 ), 
          );
          matrix2 = matrix2.rotate(0, RubikCube[i].faces[j].normal[0] * 90, 0);
        } 
        if ( Math.abs(RubikCube[i].faces[j].normal[1]) > 0 ) {
          matrix2 = matrix2.rotate(90, 0, 0);
          matrix2 = matrix2.translate(
            RubikCube[i].faces[j].normal[0] * side / 2, 
            RubikCube[i].faces[j].normal[2] * side / 2, 
            RubikCube[i].faces[j].normal[1] * side / 2, 
          );
        } else {
          matrix2 = matrix2.translate(
            RubikCube[i].faces[j].normal[0] * side / 2, 
            RubikCube[i].faces[j].normal[1] * side / 2, 
            RubikCube[i].faces[j].normal[2] * side / 2
          );
        }
        document.querySelector(`#${RubikCube[i].name}-container .${RubikCube[i].faces[j].name}`).style.transform = matrix2;
      }
    }
  }

  requestAnimationFrame(loop);
}

generateRubik();

loop();

document.querySelector("#move .U").addEventListener("click", () => turnY(1, 1, 90));
document.querySelector("#move .D").addEventListener("click", () => turnY(-1, -1, 90));
document.querySelector("#move .F").addEventListener("click", () => turnZ(1, 1, 90));
document.querySelector("#move .B").addEventListener("click", () => turnZ(-1, -1, 90));
document.querySelector("#move .R").addEventListener("click", () => turnX(-1, 1, 90));
document.querySelector("#move .L").addEventListener("click", () => turnX(1, -1, 90));