function main() {
    var CANVAS = document.getElementById("myCanvas");


    CANVAS.width = window.innerWidth-50;
    CANVAS.height = window.innerHeight-50;

    function normalizeX(x) {
        return ((x / CANVAS.width) * 2) - 1;
    }
    function normalizeY(y) {
        return -1 * (((y / CANVAS.height) * 2) - 1);
    }

    function detect(e) {
        console.log("X : " + e.pageX + ", Y: " + e.pageY);
    }


    var drag = false;
    var dX = 0;
    var dY = 0;


    var X_prev = 0;
    var Y_prev = 0;


    var cameraUp,cameraDown,cameraLeft,cameraRight = 0;


    var scaleX = 1;
    var scaleY = 1;
    var scaleZ = 1;

    var rotateX = 0;
    var rotateY = 0;

    var rotateZ = 0;
    //kiri kanan
    var translateX = 0;
    //naik turun
    var translateY = 0;
    //maju dan mundur
    var translateZ = 0;

    var FRICTION = 0.02;

    var keys = {};

    var handleKeyDown = function (e) {
        keys[e.key] = true;
    };

    var handleKeyUp = function (e) {
        keys[e.key] = false;
    };

 var handleKeys = function () {
        //CONTROL
        if (keys["s"]) {
            rotateX += 0.05;
        }
        if (keys["w"]) {
            rotateX -= 0.05;
        }
        if (keys["d"]) {
            rotateY += 0.05;
        }
        if (keys["a"]) {
            rotateY -= 0.05;
        }
        if (keys["e"]) {
            rotateZ += 0.05;
        }
        if (keys["q"]) {
            rotateZ -= 0.05;
        }
        if (keys["l"]) {
            translateX += 0.05;
        }
        if (keys["j"]) {
            translateX -= 0.05;
        }
        if (keys["i"]) {
            translateY += 0.05;
        }
        if (keys["k"]) {
            translateY -= 0.05;
        }
        if (keys["o"]) {
            translateZ += 0.5;
        }
        if (keys["p"]) {
            translateZ -= 0.5;
        }
        if (keys["m"]) {
            scaleX += 0.01;
            scaleY += 0.01;
            scaleZ += 0.01;
        }
        if (keys["n"]) {
            scaleX -= 0.01;
            scaleY -= 0.01;
            scaleZ -= 0.01;
        }

        if(keys['ArrowUp']){
            cameraUp +=0.01;
        }

    };


    document.addEventListener("keydown", handleKeyDown, false);
    document.addEventListener("keyup", handleKeyUp, false);


    var mouseDown = function (e) {
        drag = true;
        X_prev = e.pageX;
        Y_prev = e.pageY;
    }


    var mouseUp = function (e) {
        drag = false;
    }




    try {
        GL = CANVAS.getContext("webgl", { antialias: true });
    } catch (e) {
        alert("WebGL context cannot be initialized");
        return false;
    }
    //shaders
    var shader_vertex_source = `
      attribute vec3 position;
      attribute vec3 color;


      uniform mat4 PMatrix;
      uniform mat4 VMatrix;
      uniform mat4 MMatrix;
     
      varying vec3 vColor;
      void main(void) {
      gl_Position = PMatrix*VMatrix*MMatrix*vec4(position, 1.);
      vColor = color;


      gl_PointSize=60.0;
      }`;
    var shader_fragment_source = `
      precision mediump float;
      varying vec3 vColor;
      // uniform vec3 color;


      uniform float greyScality;


      void main(void) {
      float greyScaleValue = (vColor.r + vColor.g + vColor.b)/3.;
      vec3 greyScaleColor = vec3(greyScaleValue, greyScaleValue, greyScaleValue);
      vec3 color = mix(greyScaleColor, vColor, greyScality);
      gl_FragColor = vec4(color, 1.);
      }`;

    //matrix
    var PROJECTION_MATRIX = LIBS.get_projection(40, CANVAS.width / CANVAS.height, 1, 180);
    var VIEW_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX = LIBS.get_I4();
    var MODEL_MATRIX2 = LIBS.get_I4();
    var MODEL_MATRIX3 = LIBS.get_I4();
    var MODEL_MATRIX4 = LIBS.get_I4();
    var MODEL_MATRIX5 = LIBS.get_I4();
    var MODEL_MATRIX6 = LIBS.get_I4();

    LIBS.translateZ(VIEW_MATRIX, -70);
    LIBS.rotateY(VIEW_MATRIX,-0.5)
    var yPlane = -25;
    var planeSize = 50;
    var vertexPlane = [
    //    x  y   z                       r  g  b
        -planeSize,  yPlane, planeSize,  0, 1, 0,
        planeSize,  yPlane,  planeSize,  0, 1, 0,
        -planeSize,  yPlane,-planeSize,  0, 1, 0,
        planeSize,  yPlane, -planeSize,  0, 1, 0,
        ];

    var vectorTembok1 = [
        //    x        y         z       r  g  b
        -planeSize,   planeSize ,yPlane,  0, 1, 1,
        planeSize,  planeSize  ,yPlane,    0, 1, 1,
        -planeSize,  -planeSize,yPlane,  0, 1, 1,
        planeSize,   -planeSize,yPlane,  0, 1, 1,
    ]

    
    var vectorTembok2 = [
        //    x        y         z       r  g  b
        yPlane - 25,-planeSize,   planeSize,  0, 1, 1,
        yPlane - 25,planeSize,  planeSize,    0, 1, 1,
        yPlane - 25,-planeSize,  -planeSize,  0, 1, 1,
        yPlane -25, planeSize,   -planeSize, 0, 1, 1,
    ]
    
    var vectorTembok3 = [
        //    x        y         z       r  g  b
        yPlane, planeSize,   planeSize,  0, 1, 1,
        yPlane, planeSize,   planeSize,  0, 1, 1,
        yPlane, planeSize,   planeSize,  0, 1, 1,
        yPlane, planeSize,   planeSize,  0, 1, 1,
    ]

    var vectorAtap = [
         //    x  y   z                       r  g  b
         -planeSize, yPlane= 50, planeSize,  0, 1, 1,
         planeSize,  yPlane= 50,  planeSize,  0, 1, 1,
         -planeSize, yPlane= 50,-planeSize,  0, 1, 1,
         planeSize,  yPlane= 50, -planeSize,  0, 1, 1,
    ]

    var indexPlane = [
        0, 2, 1, 
        2, 3, 1];
    var plane = new MyObject(vertexPlane,indexPlane, shader_vertex_source, shader_fragment_source)
    plane.setup();
    var tembok1 = new MyObject(vectorTembok1,indexPlane, shader_vertex_source, shader_fragment_source)
    tembok1.setup()
    plane.child.push(tembok1)
    var tembok2 = new MyObject(vectorTembok2,indexPlane, shader_vertex_source, shader_fragment_source)
    tembok2.setup()
    plane.child.push(tembok2)
    var tembok3 = new MyObject(vectorTembok3,indexPlane, shader_vertex_source, shader_fragment_source)
    tembok3.setup()
    plane.child.push(tembok3)
    var atap = new MyObject(vectorAtap,indexPlane, shader_vertex_source, shader_fragment_source)
    atap.setup()
    plane.child.push(atap)

    var overall = new MyObject(Elips(0, 5, 0, 6, 5, 4, 100, 100, 1, 0, 0).vertex, Elips(0, 0, 0, 4, 4, 4, 100, 100, 1, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    overall.setup();
    var body = new MyObject(verticallyCylinderVertex(0, -6, 0, 3, 2, 4, 192, 192, 192), verticallyCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    body.setup();
    var diaper = new MyObject(Elips(0, -6, 0, 3, 2.5, 2, 100, 100, 1, 1, 1).vertex, Elips(0, -8, 5, 3, 2, 4, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    diaper.setup();
    var rightLeg = new MyObject(verticallyCylinderVertex(1.2, -10.5, 0, 1, 1, 4, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765), verticallyCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    rightLeg.setup();
    var leftLeg = new MyObject(verticallyCylinderVertex(-1.2, -10.5, 0, 1, 1, 4, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765), verticallyCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    leftLeg.setup();
    var leftArm = new MyObject(horizontalCylinderVertex(2.7, -3.7, 0, 0.75, 3, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765), horizontalCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    leftArm.setup();
    var rightArm = new MyObject(horizontalCylinderVertex(-2.7, -3.7, 0, 0.75, -3, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765), horizontalCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    rightArm.setup();
    var leftHand = new MyObject(Elips(-5.8, -3.7, 0, 1.23, 0.75, 0.7, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    leftHand.setup();
    var rightHand = new MyObject(Elips(5.8, -3.7, 0, 1.23, 0.75, 0.7, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    rightHand.setup();
    var leftToe = new MyObject(Elips(-1.2, -10.5, 0.5, 1, 0.5, 1.5, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    leftToe.setup();
    var rightToe = new MyObject(Elips(1.2, -10.5, 0.5, 1, 0.5, 1.5, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    rightToe.setup();
    var leftFinger1 = new MyObject(Elips(-6, -2.7, 0, 0.4, 0.7, 0.3, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    leftFinger1.setup();
    var leftFinger2 = new MyObject(Elips(-7, -3.3, 0, 0.7, 0.3, 0.3, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    leftFinger2.setup();
    var leftFinger3 = new MyObject(Elips(-7, -4, 0, 0.7, 0.3, 0.3, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    leftFinger3.setup();
    var rightFinger1 = new MyObject(Elips(6, -2.7, 0, 0.4, 0.7, 0.3, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    rightFinger1.setup();
    var rightFinger2 = new MyObject(Elips(7, -3.3, 0, 0.7, 0.3, 0.3, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    rightFinger2.setup();
    var rightFinger3 = new MyObject(Elips(7, -4, 0, 0.7, 0.3, 0.3, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    rightFinger3.setup();
    var leftEye = new MyObject(Elips(-1.3, 0.3, 2.6, 1, 1, 1, 100, 100, 1, 1, 1).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    leftEye.setup();
    var rightEye = new MyObject(Elips(1.3, 0.3, 2.6, 1, 1, 1, 100, 100, 1, 1, 1).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    rightEye.setup();
    var leftPupil = new MyObject(Elips(-1.3, 0.3, 3.5, 0.2, 0.2, 0.2, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    leftPupil.setup();
    var rightPupil = new MyObject(Elips(1.3, 0.3, 3.5, 0.2, 0.2, 0.2, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    rightPupil.setup();
    var leftEyebrow = new MyObject(generateEyebrowVertices(-2.3, 6.4, 5, 2, 1, 0.1, 0, 0, 0), generateEyebrowIndexes(), shader_vertex_source, shader_fragment_source);
    leftEyebrow.setup();
    var rightEyebrow = new MyObject(generateEyebrowVertices(2.3, 6.4, 5, -2, 1, 0.1, 0, 0, 0), generateEyebrowIndexes(), shader_vertex_source, shader_fragment_source);
    rightEyebrow.setup();
    var mouth = new MyObject(Elips(0, -1.5, 2.5, 0.2, 0.2, 0.2, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    mouth.setup();
    var leftEar = new MyObject(Elips(-5, 0, 0, 0.5, 0.5, 0.2, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    leftEar.setup();
    var rightEar = new MyObject(Elips(5, 0, 0, 0.5, 0.5, 0.2, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    rightEar.setup();
    var hair1 = new MyObject(Elips(0, 1.3, 0, 0.1, 2, 2.1, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hair1.setup();
    var hair2 = new MyObject(Elips(1, 1.3, 0, 0.1, 2, 2.1, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hair2.setup();
    var hair3 = new MyObject(Elips(2, 1.1, 0, 0.1, 2, 2.1, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hair3.setup();
    var hair4 = new MyObject(Elips(3, 0.6, 0, 0.1, 2, 2.1, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hair4.setup();
    var hair5 = new MyObject(Elips(4, 0.3, 0, 0.1, 2, 1.6, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hair5.setup();
    var hair6 = new MyObject(Elips(-1, 1.3, 0, 0.1, 2, 2.1, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hair6.setup();
    var hair7 = new MyObject(Elips(-2, 1.1, 0, 0.1, 2, 2.1, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hair7.setup();
    var hair8 = new MyObject(Elips(-3, 0.6, 0, 0.1, 2, 2.1, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hair8.setup();
    var hair9 = new MyObject(Elips(-4, 0.3, 0, 0.1, 2, 1.6, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hair9.setup();
    var mulut = new MyObject(Kumis([
        -1, 3.1, 4.5, 0, 0, 0,
        0, 2.5, 4.5, 0, 0, 0,
        1, 3.1, 4.5, 0, 0, 0,
    ], 0.1).vertices, Kumis([
        -1, -1.1, 4, 0, 0, 0,
        0, -0.2, 4, 0, 0, 0,
        1, -1.1, 4, 0, 0, 0
    ], 0.1).indices, shader_vertex_source, shader_fragment_source);
    mulut.setup();


    var muka = new MyObject(Elips(0, 5, 1, 4, 4, 4, 100, 100, 0.9725490196078431, 0.8313725490196079, 0.7058823529411765).vertex, Elips(0, 0, 0, 4, 4, 4, 100, 100, 1, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    muka.setup();
    var body2 = new MyObject(verticallyCylinderVertex(0, -12, 0, 7, 3, 10, 1, 0, 0), verticallyCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    body2.setup();
    var leher = new MyObject(verticallyCylinderVertex(0, -2.5, 0, 2, 2, 4, 1, 0, 0), verticallyCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    leher.setup();
    var bahu = new MyObject(Elips(0, -2, 0, 7, 3, 3, 100, 100, 1, 0, 0).vertex, Elips(0, -11, 5, 3, 2, 4, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    bahu.setup();
    var hidung = new MyObject(Elips(0, 3, 4.256, 0.3, 0.3, 0.3, 100, 100, 0, 0, 0).vertex, Elips(0, 0, 0, 2, 2, 2, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    hidung.setup();
    var celana = new MyObject(Elips(0, -12, 0, 7, 3, 3, 100, 100, 1, 0, 0).vertex, Elips(0, -11, 5, 3, 2, 4, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    celana.setup();
    var kakiKiri = new MyObject(verticallyCylinderVertex(3, -19, 0, 2, 1, 5, 1,0,0), verticallyCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    kakiKiri.setup();
    var kakiKanan = new MyObject(verticallyCylinderVertex(-3, -19, 0, 2, 1, 5, 1,0,0), verticallyCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    kakiKanan.setup();
    var lenganKiri = new MyObject(horizontalCylinderVertex(6.7, -3.7, 0, 0.90, 6, 1,0,0), horizontalCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    lenganKiri.setup();
    var lenganKanan = new MyObject(horizontalCylinderVertex(-6.7, -3.7, 0, 0.90, -6, 1,0,0), horizontalCylinderIndexes(), shader_vertex_source, shader_fragment_source);
    lenganKanan.setup();
    var telapakKiri = new MyObject(Elips(13.8, -3.7, 0, 2.23, 1, 1, 100, 100, 1,0,0).vertex, Elips(-5, 0, 5, 1.23, 1, 1, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    telapakKiri.setup();
    var telapakKanan = new MyObject(Elips(-13.8, -3.7, 0, 2.23, 1, 1, 100, 100, 1,0,0).vertex, Elips(-5, 0, 5, 1.23, 1, 1, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    telapakKanan.setup();
    var telapakKakiKanan =  new MyObject(Elips(  -3, -19, 0.5, 2, 0.5, 1.5, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    telapakKakiKanan.setup();
    var telapakKakiKiri = new MyObject(Elips(     3, -19, 0.5, 2, 0.5, 1.5, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    telapakKakiKiri.setup();
    var telingaKiri = new MyObject(Elips(4.15, 0, 0, 0.5, 0.5, 0.5, 100, 100, 1, 1, 0).vertex, Elips(0, 0, 0, 0.5, 0.5, 0.5, 100, 100, 1, 1, 0).indexes, shader_vertex_source, shader_fragment_source);
    telingaKiri.setup();
    var telingaKanan = new MyObject(Elips(-4.15, 0, 0, 0.5, 0.5, 0.5, 100, 100, 1, 1, 0).vertex, Elips(0, 0, 0, 0.5, 0.5, 0.5, 100, 100, 1, 1, 0).indexes, shader_vertex_source, shader_fragment_source);
    telingaKanan.setup();
    var mataKiri =  new MyObject(Elips(1.3, 5, 4.1, 1, 1, 1, 100, 100, 1, 1, 1).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    mataKiri.setup();
    var mataKanan =  new MyObject(Elips(-1.3, 5, 4.1, 1, 1, 1, 100, 100, 1, 1, 1).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    mataKanan.setup();
    var pupilKiri = new MyObject(Elips(1.4, 5, 5.03, 0.2, 0.2, 0.2, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    pupilKiri.setup();
    var pupilKanan = new MyObject(Elips(-1.4, 5, 5.03, 0.2, 0.2, 0.2, 100, 100, 0, 0, 0).vertex, Elips(-5, 0, 5, 1.23, 0.75, 0.5, 100, 100, 0, 0, 0).indexes, shader_vertex_source, shader_fragment_source);
    pupilKanan.setup();
    var alis = new MyObject(generateEyebrowVertices(-2, 5.3, 3.4, 4, 1, 0.3, 0, 0, 0),generateEyebrowIndexes(), shader_vertex_source, shader_fragment_source);
    alis.setup();


    // overall.child.push(body);
    // overall.child.push(diaper);
    // overall.child.push(rightLeg);
    // overall.child.push(leftLeg);
    // overall.child.push(leftArm);
    // overall.child.push(rightArm);
    // overall.child.push(leftHand);
    // overall.child.push(rightHand);
    // overall.child.push(leftToe);
    // overall.child.push(rightToe);
    // overall.child.push(leftFinger1);
    // overall.child.push(leftFinger2);
    // overall.child.push(leftFinger3);
    // overall.child.push(rightFinger1);
    // overall.child.push(rightFinger2);
    // overall.child.push(rightFinger3);
    // overall.child.push(leftEye);
    // overall.child.push(rightEye);
    // overall.child.push(leftPupil);
    // overall.child.push(rightPupil);
 
    // overall.child.push(mouth);
    // overall.child.push(leftEar);
    // overall.child.push(rightEar);
    // overall.child.push(hair1);
    // overall.child.push(hair2);
    // overall.child.push(hair3);
    // overall.child.push(hair4);
    // overall.child.push(hair5);
    // overall.child.push(hair6);
    // overall.child.push(hair7);
    // overall.child.push(hair8);
    // overall.child.push(hair9);
    // overall.child.push(hidung);
    overall.child.push(leftEyebrow);//   0
    overall.child.push(rightEyebrow); // 1
    overall.child.push(bahu)          // 2
    overall.child.push(mulut);        // 3
    overall.child.push(muka);         // 4
    overall.child.push(body2);        // 5
    overall.child.push(leher);        // 6
    overall.child.push(celana);       // 7
    
    overall.child.push(kakiKiri);
    overall.child.push(kakiKanan);
    overall.child.push(lenganKiri);
    lenganKiri.child.push(telapakKiri)
    overall.child.push(lenganKanan);
    overall.child.push(telapakKiri);
    overall.child.push(telapakKanan);
    overall.child.push(telapakKakiKanan);
    overall.child.push(telapakKakiKiri);
    // overall.child.push(telingaKiri);
    // overall.child.push(telingaKanan);
    overall.child.push(mataKiri);
    overall.child.push(mataKanan);
    overall.child.push(pupilKiri);
    overall.child.push(pupilKanan);
    // overall.child.push(alis);

    





    GL.clearColor(1, 1, 1, 1);

    // console.log(overall.child)
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    var animasiTemp = 0;
    var animasiTemp2 = 0;
    var temp = LIBS.get_I4();
    var animasiRotate = 0;
    var time_prev = 0;
    var reverse = false;
    var reverse2 = false;
    var animate = function (time) {
        GL.viewport(0, 0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.D_BUFFER_BIT);
        var dt = time - time_prev;
        time_prev = time / 1000;
        
        MODEL_MATRIX = LIBS.get_I4();
        ANIMASI_MATRIX = LIBS.get_I4();
        ANIMASI_MATRIX2 = LIBS.get_I4();
        TEMP_MATRIX = LIBS.get_I4();
        
        

        if(!reverse){
            if(animasiTemp < 1.1){
                
                animasiTemp += 0.01;
                // console.log(animasiTemp)
                LIBS.rotateZ(ANIMASI_MATRIX,animasiTemp)
                lenganKiri.MODEL_MATRIX = ANIMASI_MATRIX;
                telapakKiri.MODEL_MATRIX = ANIMASI_MATRIX;
                LIBS.translateY(TEMP_MATRIX,animasiTemp);
            }else{
                reverse = true;
            }
        } else {
            if(animasiTemp > 0){
                
                animasiTemp -= 0.01;
                // console.log(animasiTemp)
                LIBS.rotateZ(ANIMASI_MATRIX,animasiTemp)
                lenganKiri.MODEL_MATRIX = ANIMASI_MATRIX;
                telapakKiri.MODEL_MATRIX = ANIMASI_MATRIX;
                LIBS.translateY(TEMP_MATRIX,animasiTemp)
            }else{
                reverse = false;
            }
        } 

        
        if(!reverse2){
            if(animasiTemp2 > -1.1){
                
                animasiTemp2 -= 0.01;
                // console.log(animasiTemp2)
                LIBS.rotateZ(ANIMASI_MATRIX2,animasiTemp2)
                // LIBS.rotateX(ANIMASI_MATRIX2,animasiTemp2)
                lenganKanan.MODEL_MATRIX = ANIMASI_MATRIX2;
                telapakKanan.MODEL_MATRIX = ANIMASI_MATRIX2;
                
                // LIBS.scale(ANIMASI_MATRIX2,0,0,0)
            }else{
                reverse2 = true;
            }
        } else {
            if(animasiTemp2 < 0){
                
                animasiTemp2 += 0.01;
                // console.log(animasiTemp2)
                LIBS.rotateZ(ANIMASI_MATRIX2,animasiTemp2)
                // LIBS.rotateX(ANIMASI_MATRIX2,animasiTemp2)
                lenganKanan.MODEL_MATRIX = ANIMASI_MATRIX2;
                telapakKanan.MODEL_MATRIX = ANIMASI_MATRIX2;
                LIBS.scaleX
            }else{
                reverse2 = false;
            }
        } 

        
        LIBS.rotateX(MODEL_MATRIX, rotateX);
        LIBS.rotateY(MODEL_MATRIX, rotateY);
        LIBS.rotateZ(MODEL_MATRIX, rotateZ);
        LIBS.translateX(MODEL_MATRIX, translateX);
        LIBS.translateY(MODEL_MATRIX, translateY);
        LIBS.translateZ(MODEL_MATRIX, translateZ);
        // LIBS.setPosition(MODEL_MATRIX, 0, 0, 0);
        LIBS.scale(MODEL_MATRIX, scaleX, scaleY, scaleZ);

        // animasi
        

        var MODEL_MATRIX2 = LIBS.get_I4();
        

        overall.MODEL_MATRIX = TEMP_MATRIX;
        body.MODEL_MATRIX = MODEL_MATRIX;
        // diaper.MODEL_MATRIX = MODEL_MATRIX;
        // rightLeg.MODEL_MATRIX = MODEL_MATRIX;
        // leftLeg.MODEL_MATRIX = MODEL_MATRIX;
        // leftArm.MODEL_MATRIX = MODEL_MATRIX;
        // rightArm.MODEL_MATRIX = MODEL_MATRIX;
        // leftHand.MODEL_MATRIX = MODEL_MATRIX;
        // rightHand.MODEL_MATRIX = MODEL_MATRIX;
        // leftToe.MODEL_MATRIX = MODEL_MATRIX;
        // rightToe.MODEL_MATRIX = MODEL_MATRIX;
        // leftFinger1.MODEL_MATRIX = MODEL_MATRIX;
        // leftFinger2.MODEL_MATRIX = MODEL_MATRIX;
        // leftFinger3.MODEL_MATRIX = MODEL_MATRIX;
        // rightFinger1.MODEL_MATRIX = MODEL_MATRIX;
        // rightFinger2.MODEL_MATRIX = MODEL_MATRIX;
        // rightFinger3.MODEL_MATRIX = MODEL_MATRIX;
        // leftEye.MODEL_MATRIX = MODEL_MATRIX;
        // rightEye.MODEL_MATRIX = MODEL_MATRIX;
        // leftPupil.MODEL_MATRIX = MODEL_MATRIX;
        // rightPupil.MODEL_MATRIX = MODEL_MATRIX;
        leftEyebrow.MODEL_MATRIX = TEMP_MATRIX;
        rightEyebrow.MODEL_MATRIX = TEMP_MATRIX;
        // mouth.MODEL_MATRIX = MODEL_MATRIX;
        // leftEar.MODEL_MATRIX = MODEL_MATRIX;
        // rightEar.MODEL_MATRIX = MODEL_MATRIX;
        // hair1.MODEL_MATRIX = MODEL_MATRIX;
        // hair2.MODEL_MATRIX = MODEL_MATRIX;
        // hair3.MODEL_MATRIX = MODEL_MATRIX;
        // hair4.MODEL_MATRIX = MODEL_MATRIX;
        // hair5.MODEL_MATRIX = MODEL_MATRIX;
        // hair6.MODEL_MATRIX = MODEL_MATRIX;
        // hair7.MODEL_MATRIX = MODEL_MATRIX;
        // hair8.MODEL_MATRIX = MODEL_MATRIX;
        // hair9.MODEL_MATRIX = MODEL_MATRIX;
        mulut.MODEL_MATRIX = TEMP_MATRIX;
        muka.MODEL_MATRIX = TEMP_MATRIX;
        body2.MODEL_MATRIX = TEMP_MATRIX;
        leher.MODEL_MATRIX = TEMP_MATRIX;
        bahu.MODEL_MATRIX= TEMP_MATRIX;
        celana.MODEL_MATRIX = TEMP_MATRIX;
        // hidung.MODEL_MATRIX = MODEL_MATRIX;
        kakiKiri.MODEL_MATRIX = TEMP_MATRIX;
        kakiKanan.MODEL_MATRIX = TEMP_MATRIX;
        // lenganKiri.MODEL_MATRIX = MODEL_MATRIX;
        // lenganKanan.MODEL_MATRIX = MODEL_MATRIX;
        // telapakKiri.MODEL_MATRIX = MODEL_MATRIX;
        // telapakKanan.MODEL_MATRIX = MODEL_MATRIX;
        telapakKakiKanan.MODEL_MATRIX = TEMP_MATRIX;
        telapakKakiKiri.MODEL_MATRIX = TEMP_MATRIX;
        // telingaKiri.MODEL_MATRIX = MODEL_MATRIX;
        // telingaKanan.MODEL_MATRIX = MODEL_MATRIX;
        mataKiri.MODEL_MATRIX = TEMP_MATRIX;
        mataKanan.MODEL_MATRIX = TEMP_MATRIX;
        pupilKiri.MODEL_MATRIX = TEMP_MATRIX;
        pupilKanan.MODEL_MATRIX = TEMP_MATRIX;
        // alis.MODEL_MATRIX = MODEL_MATRIX;





        overall.render(VIEW_MATRIX, PROJECTION_MATRIX);
        plane.render(VIEW_MATRIX, PROJECTION_MATRIX)
        handleKeys();

        window.requestAnimationFrame(animate);
    };
    animate(0);
}
window.addEventListener('load', main);