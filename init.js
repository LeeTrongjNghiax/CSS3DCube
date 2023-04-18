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

StringToMatrix = string => {
	let matrix = new DOMMatrix();
	if (string == '') return matrix;

	let arr = string.match(/[-]{0,1}[\d]*[.]{0,1}[\d]+(?!d)/g);

	if ( arr.length > 6 ) {
			matrix.m11 = arr[0];
			matrix.m12 = arr[1];
			matrix.m13 = arr[2];
			matrix.m14 = arr[3];
			matrix.m21 = arr[4];
			matrix.m22 = arr[5];
			matrix.m23 = arr[6];
			matrix.m24 = arr[7];
			matrix.m31 = arr[8];
			matrix.m32 = arr[9];
			matrix.m33 = arr[10];
			matrix.m34 = arr[11];
			matrix.m41 = arr[12];
			matrix.m42 = arr[13];
			matrix.m43 = arr[14];
			matrix.m44 = arr[15];
	} else {
			matrix.m11 = arr[0];
			matrix.m12 = arr[1];
			matrix.m13 = 0;
			matrix.m14 = 0;
			matrix.m21 = arr[2];
			matrix.m22 = arr[3];
			matrix.m23 = 0;
			matrix.m24 = 0;
			matrix.m31 = 0;
			matrix.m32 = 0;
			matrix.m33 = 1;
			matrix.m34 = 0;
			matrix.m41 = arr[4];
			matrix.m42 = arr[5];
			matrix.m43 = 0;
			matrix.m44 = 1;
	}

	// printMatrix3D( matrix )
	return matrix;
}

degreesToradians = degrees => degrees * ( Math.PI / 180);

turnY = (index, dir, angle) => {
	for (let i = 0; i < RubikCube.length; i++) {
		if ( RubikCube[i].positions.y == index * side ) {
			let matrix = new DOMMatrix();
      matrix = matrix.rotate(dir * angle);
      matrix = matrix.translate(RubikCube[i].positions.x, RubikCube[i].positions.y, RubikCube[i].positions.z);
			RubikCubeElem[i].style.transform = matrix

			RubikCube[i].update(matrix.m41, RubikCube[i].positions.y, matrix.m42);
			RubikCube[i].turnFaceY(-dir, degreesToradians(angle) );
		}
	}
}
turnZ = (index, dir, angle) => {
	for (let i = 0; i < RubikCube.length; i++) {
		if ( RubikCube[i].positions.z == index * side ) {
			let matrix = new DOMMatrix();
			matrix = matrix.rotate(dir * angle);
      		matrix = matrix.translate(RubikCube[i].positions.x, RubikCube[i].positions.y, RubikCube[i].positions.z);
			RubikCubeElem[i].style.transform = matrix
			RubikCubeElem[i].dataset.x = matrix.m41;
			RubikCubeElem[i].dataset.y = matrix.m42;
			RubikCubeElem[i].dataset.z = RubikCube[i].positions.z;

      		RubikCube[i].update(matrix.m41, matrix.m42, RubikCube[i].positions.z);
      		RubikCube[i].turnFaceZ(-dir, degreesToradians(angle) );
		}
	}
}
turnX = (index, dir, angle) => {
	for (let i = 0; i < RubikCube.length; i++) {
		if ( RubikCube[i].positions.x == index * side ) {
			let matrix = new DOMMatrix();
      matrix = matrix.rotate(dir * angle, 0, 0);
      matrix = matrix.translate(RubikCube[i].positions.x, RubikCube[i].positions.y, RubikCube[i].positions.z);
			RubikCubeElem[i].style.transform = matrix

			RubikCube[i].update(RubikCube[i].positions.x, matrix.m41, matrix.m42);
			RubikCube[i].turnFaceX(-dir, degreesToradians(angle) );
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

			let matrix = new DOMMatrix();
			matrix = matrix.translate(
				RubikCube[i].positions.x * 1, 
				RubikCube[i].positions.y * 1, 
				RubikCube[i].positions.z * 1
			);
			document.querySelector(`#${RubikCube[i].name}-container`).style.transform = matrix;
			document.querySelector(`#${RubikCube[i].name}-container`).dataset.x = RubikCube[i].positions.x;
			document.querySelector(`#${RubikCube[i].name}-container`).dataset.y = RubikCube[i].positions.y;
			document.querySelector(`#${RubikCube[i].name}-container`).dataset.z = RubikCube[i].positions.z;

			for (let j = 0; j < RubikCube[i].faces.length; j++) {
				let matrix2 = new DOMMatrix();
				if ( Math.abs(RubikCube[i].faces[j].normal[0]) > 0 ) {
					matrix2 = matrix2.rotate(0, RubikCube[i].faces[j].normal[0] * 90, 0);
					matrix2 = matrix2.translate(
						RubikCube[i].faces[j].normal[0] * side / -1, 
						RubikCube[i].faces[j].normal[2] * side / 1, 
						Math.abs( RubikCube[i].faces[j].normal[0] * side / 1 ), 
					);
				} 
				if ( Math.abs(RubikCube[i].faces[j].normal[1]) > 0 ) {
					matrix2 = matrix2.rotate(90, 0, 0);
					matrix2 = matrix2.translate(
						RubikCube[i].faces[j].normal[0] * side / 1, 
						RubikCube[i].faces[j].normal[2] * side / 1, 
						RubikCube[i].faces[j].normal[1] * side / 1, 
					);
				} else {
					matrix2 = matrix2.translate(
						RubikCube[i].faces[j].normal[0] * side / 1, 
						RubikCube[i].faces[j].normal[1] * side / 1, 
						RubikCube[i].faces[j].normal[2] * side / 1
					);
				}
				document.querySelector(`#${RubikCube[i].name}-container .${RubikCube[i].faces[j].name}`).style.transform = matrix2;
			}
		}
	}
}