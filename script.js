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
      let matrix;
      if ( document.querySelector(`#${RubikCube[i].name}-container`).style.transform == '' ) {
        matrix = new DOMMatrix();
        matrix = matrix.translate(
          RubikCube[i].positions.x * side, 
          RubikCube[i].positions.y * side, 
          RubikCube[i].positions.z * side
        );
      } else {
        // matrix = StringToMatrix( document.querySelector(`#${RubikCube[i].name}-container`).style.transform );
      }
      // document.querySelector(`#${RubikCube[i].name}-container`).style.transform = matrix;

      for (let j = 0; j < RubikCube[i].faces.length; j++) {
        let matrix2 = new DOMMatrix();
        if ( Math.abs(RubikCube[i].faces[j].normal[0]) > 0 ) {
          matrix2 = matrix2.rotate(0, RubikCube[i].faces[j].normal[0] * 90, 0);
          matrix2 = matrix2.translate(
            RubikCube[i].faces[j].normal[0] * side / -ratio, 
            RubikCube[i].faces[j].normal[2] * side / ratio, 
            Math.abs( RubikCube[i].faces[j].normal[0] * side / ratio ), 
          );
        } 
        if ( Math.abs(RubikCube[i].faces[j].normal[1]) > 0 ) {
          matrix2 = matrix2.rotate(90, 0, 0);
          matrix2 = matrix2.translate(
            RubikCube[i].faces[j].normal[0] * side / ratio, 
            RubikCube[i].faces[j].normal[2] * side / ratio, 
            RubikCube[i].faces[j].normal[1] * side / ratio, 
          );
        } else {
          matrix2 = matrix2.translate(
            RubikCube[i].faces[j].normal[0] * side / ratio, 
            RubikCube[i].faces[j].normal[1] * side / ratio, 
            RubikCube[i].faces[j].normal[2] * side / ratio
          );
        }
        document.querySelector(`#${RubikCube[i].name}-container .${RubikCube[i].faces[j].name}`).style.transform = matrix2;
      }
    }
  }

  // requestAnimationFrame(loop);
}

const side = getComputedStyle(document.body).getPropertyValue('--length').slice(0, -2) / getComputedStyle(document.body).getPropertyValue('--length-ratio');
const faces = ["up", "down", "front", "back", "right", "left"];
const colors = ["white", "yellow", "green", "blue", "red", "orange"];
const ratio = 2;
let RubikCube = [];
let RubikCubeElem = [];
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
      name += (y > 0) ? "U" : (y < 0) ? "D" : "";
      name += (z > 0) ? "F" : (z < 0) ? "B" : "";
      name += (x > 0) ? "L" : (x < 0) ? "R" : "";
      name = (name == "") ? "core" : name;

      let matrix = new DOMMatrix();
      matrix = matrix.translate(x * side, y * side, z * side);

      let f = [];
      f.push(
        new Face([0, -1, 0], faces[0], colors[0]), 
        new Face([0, 1, 0], faces[1], colors[1]), 
        new Face([0, 0, 1], faces[2], colors[2]), 
        new Face([0, 0, -1], faces[3], colors[3]), 
        new Face([1, 0, 0], faces[4], colors[4]), 
        new Face([-1, 0, 0], faces[5], colors[5]), 
      );

      RubikCube[index] = new Cubie({x: x * side, y: y * side, z: z * side}, matrix, type, name, f);
      index++;
    }
  }
}

generateRubik();

index = 0;

for (let x = -1; x <= 1; x++) {
  for (let y = -1; y <= 1; y++) {
    for (let z = -1; z <= 1; z++) {
      RubikCubeElem.push( document.querySelector(`#${RubikCube[index].name}-container`) );
      index++;
    }
  }
}

loop();

document.querySelector("#move .U").addEventListener("click", () => turnY(1, -1, 90));
document.querySelector("#move .D").addEventListener("click", () => turnY(-1, 1, 90));
document.querySelector("#move .F").addEventListener("click", () => turnZ(1, 1, 90));
document.querySelector("#move .B").addEventListener("click", () => turnZ(-1, -1, 90));
document.querySelector("#move .R").addEventListener("click", () => turnX(-1, -1, 90));
document.querySelector("#move .L").addEventListener("click", () => turnX(1, 1, 90));