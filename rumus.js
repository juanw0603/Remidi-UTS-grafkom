function verticallyCylinderVertex(x, y, z, radiusSbX, radiusSbZ, height, r, g, b) {
  var vertex = [];
  vertex.push(x);
  vertex.push(y);
  vertex.push(z);
  vertex.push(r);
  vertex.push(g);
  vertex.push(b);
  for (let i = 0; i <= 360; i++) {
    var angleInRadians = (i * Math.PI) / 180;
    var newX = x + Math.cos(angleInRadians) * radiusSbX;
    var newY = y;
    var newZ = z + Math.sin(angleInRadians) * radiusSbZ;
    vertex.push(newX);
    vertex.push(newY);
    vertex.push(newZ);
    vertex.push(r);
    vertex.push(g);
    vertex.push(b);
  }
  vertex.push(x);
  vertex.push(y + height);
  vertex.push(z);
  vertex.push(r);
  vertex.push(g);
  vertex.push(b);
  for (let i = 0; i <= 360; i++) {
    var angleInRadians = (i * Math.PI) / 180;
    var newX = x + Math.cos(angleInRadians) * radiusSbX;
    var newY = y + height;
    var newZ = z + Math.sin(angleInRadians) * radiusSbZ;
    vertex.push(newX);
    vertex.push(newY);
    vertex.push(newZ);
    vertex.push(r);
    vertex.push(g);
    vertex.push(b);
  }
  return vertex;
}
function verticallyCylinderIndexes() {
  var indexes = [];

  for (let i = 0; i <= 360; i++) {
    indexes.push(0);
    indexes.push(i + 1);
    indexes.push(i + 2);
  }
  for (let i = 362; i < 722; i++) {
    indexes.push(362);
    indexes.push(i + 1);
    indexes.push(i + 2);
  }
  for (let i = 1; i <= 361; i++) {
    indexes.push(i);
    indexes.push(360 + i);
    indexes.push(361 + i);

    indexes.push(361 + i);
    indexes.push(i);
    indexes.push(i + 1);
  }
  return indexes;
}
function Elips(x, y, z, xRadius, yRadius, zRadius, latitudeBands, longitudeBands, r, g, b) {
  const vertex = [];
  const indexes = [];

  for (let lat = 0; lat <= latitudeBands; lat++) {
    const theta = lat * Math.PI / latitudeBands;
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let long = 0; long <= longitudeBands; long++) {
      const phi = long * 2 * Math.PI / longitudeBands;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const xPosition = x + xRadius * cosPhi * sinTheta;
      const yPosition = y + yRadius * sinPhi * sinTheta;
      const zPosition = z + zRadius * cosTheta;

      vertex.push(xPosition, yPosition, zPosition, r, g, b);
    }
  }

  for (let lat = 0; lat < latitudeBands; lat++) {
    for (let long = 0; long < longitudeBands; long++) {
      const first = (lat * (longitudeBands + 1)) + long;
      const second = first + longitudeBands + 1;

      indexes.push(first, second, first + 1);
      indexes.push(second, second + 1, first + 1);
    }
  }

  return { vertex, indexes };
}
function horizontalCylinderVertex(x, y, z, radius, length, r, g, b) {
  var vertex = [];

  var vertex = [];
  vertex.push(x);
  vertex.push(y);
  vertex.push(z);
  vertex.push(r);
  vertex.push(g);
  vertex.push(b);
  for (let i = 0; i <= 360; i++) {

    var angleInRadians = (i * Math.PI) / 180;
    var newX = x;
    var newY = y + Math.cos(angleInRadians) * radius;
    var newZ = z + Math.sin(angleInRadians) * radius;
    vertex.push(newX);
    vertex.push(newY);
    vertex.push(newZ);
    vertex.push(r);
    vertex.push(g);
    vertex.push(b);
  }
  vertex.push(x + length);
  vertex.push(y);
  vertex.push(z);
  vertex.push(r);
  vertex.push(g);
  vertex.push(b);
  for (let i = 0; i <= 360; i++) {
    var angleInRadians = (i * Math.PI) / 180;
    var newX = x + length;
    var newY = y + Math.cos(angleInRadians) * radius;
    var newZ = z + Math.sin(angleInRadians) * radius;
    vertex.push(newX);
    vertex.push(newY);
    vertex.push(newZ);
    vertex.push(r);
    vertex.push(g);
    vertex.push(b);
  }
  return vertex;
}
function horizontalCylinderIndexes() {
  var indexes = [];

  for (let i = 0; i < 360; i++) {
    indexes.push(0);
    indexes.push(i + 1);
    indexes.push(i + 2);
  }
  for (let i = 362; i < 722; i++) {
    indexes.push(362);
    indexes.push(i + 1);
    indexes.push(i + 2);
  }
  for (let i = 1; i <= 361; i++) {
    indexes.push(i);
    indexes.push(360 + i);
    indexes.push(361 + i);

    indexes.push(361 + i);
    indexes.push(i);
    indexes.push(i + 1);
  }
  return indexes;
}

function generateEyebrowVertices(x, y, z, p, l, t, r, g, b,){

  var vertices = [];

  vertices.push(x,y,z,r,g,b);
  vertices.push(x+p,y,z,r,g,b);
  vertices.push(x+p,y+t,z,r,g,b);
  vertices.push(x,y+t,z,r,g,b);
  
  vertices.push(x,y,z-l,r,g,b);
  vertices.push(x+p,y,z-l,r,g,b);
  vertices.push(x+p,y+t,z-l,r,g,b);
  vertices.push(x,y+t,z-l,r,g,b);

  return vertices;
}
//Balok
function generateEyebrowIndexes(){
  var indexes = [];
  
  indexes.push(3);
  indexes.push(2);
  indexes.push(7);
  
  indexes.push(2);
  indexes.push(6);
  indexes.push(7);
  
  indexes.push(0);
  indexes.push(1);
  indexes.push(4);

  indexes.push(1);
  indexes.push(4);
  indexes.push(5);

  indexes.push(1);
  indexes.push(2);
  indexes.push(5);

  indexes.push(2);
  indexes.push(5);
  indexes.push(6);
  
  indexes.push(4);
  indexes.push(5);
  indexes.push(6);

  indexes.push(4);
  indexes.push(6);
  indexes.push(7);

  indexes.push(3);
  indexes.push(0);
  indexes.push(4);

  indexes.push(0);
  indexes.push(1);
  indexes.push(2);

  indexes.push(2);
  indexes.push(0);
  indexes.push(3);
  
  indexes.push(3);
  indexes.push(4);
  indexes.push(7);
  
  return indexes;
}
function generateBSpline(controlPoint, m, degree){
  var curves = [];
  var knotVector = [];

  var n = controlPoint.length/6;

 
  // Calculate the knot values based on the degree and number of control points
  for (var i = 0; i < n + degree+1; i++) {
    if (i < degree + 1) {
      knotVector.push(0);
    } else if (i >= n) {
      knotVector.push(n - degree);
    } else {
      knotVector.push(i - degree);
    }
  }



  var basisFunc = function(i,j,t){
      if (j == 0){
        if(knotVector[i] <= t && t<(knotVector[(i+1)])){
          return 1;
        }else{
          return 0;
        }
      }

      var den1 = knotVector[i + j] - knotVector[i];
      var den2 = knotVector[i + j + 1] - knotVector[i + 1];
     
      var term1 = 0;
      var term2 = 0;
   
 
      if (den1 != 0 && !isNaN(den1)) {
        term1 = ((t - knotVector[i]) / den1) * basisFunc(i,j-1,t);
      }
   
      if (den2 != 0 && !isNaN(den2)) {
        term2 = ((knotVector[i + j + 1] - t) / den2) * basisFunc(i+1,j-1,t);
      }
   
      return term1 + term2;
  }

 
  for(var t=0;t<m;t++){
    var x=0;
    var y=0;
    var z=0;
    var r=0;
    var g=0;
    var b=0;

    var u = (t/m * (knotVector[controlPoint.length/6] - knotVector[degree]) ) + knotVector[degree] ;

    //C(t)
    for(var key =0;key<n;key++){

      var C = basisFunc(key,degree,u);
      x+=(controlPoint[key*6] * C);
      y+=(controlPoint[key*6+1] * C);
      z+=(controlPoint[key*6+2] * C);
      r+=(controlPoint[key*6+3] * C);
      g+=(controlPoint[key*6+4] * C);
      b+=(controlPoint[key*6+5] * C);
    }
    curves.push(x);
    curves.push(y);
    curves.push(z);
    curves.push(r);
    curves.push(g);
    curves.push(b);
   
  }
  return curves;
}
function Kumis(titik_kontrol, jari_jari){
  var totalPoints = 100

  var vertices = [];
  var indices = [];
  var points = generateBSpline(titik_kontrol, totalPoints, 2);

  for (let i = 0; i < totalPoints*2; i++) {
    for (let j = 0; j < 360; j++) {
      var angleInRadians = (j * Math.PI) / 180;
      var x = points[i*6];

      var y = points[i*6+1] + Math.cos(angleInRadians) * jari_jari;

      var z = points[i*6+2] + Math.sin(angleInRadians) * jari_jari;


      var r = points[i*6+3];
      var g = points[i*6+4];

      var b = points[i*6+5];
      vertices.push(x);
      vertices.push(y);
      vertices.push(z);
      vertices.push(r);
      vertices.push(g);
      vertices.push(b);
    }
  }
  for (let i = 0; i < totalPoints*2; i++) {
    for (let j = 0; j < 360; j++) {
      indices.push(j+(i*360));
      indices.push(j+1+(i*360));
      indices.push(j+361+(i*360));
      indices.push(j+(i*360));
      indices.push(j+360+(i*360));
      indices.push(j+361+(i*360));
    }
  }
  
  return {vertices, indices};
}