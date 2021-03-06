var Pts = [];
var dist;
var inputValue;
var ratio;
var angle;

var vertBool = false;
var horzBool = false;

var inputElement = document.getElementById("input_file");

inputElement.addEventListener("change", handleFiles, false);
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');

function handleFiles(e) {
  console.log("running handleFiles()");
  // Clear Pts[] array if a new drawing is uploaded
  console.log("BEFORE: Pts.length = " + Pts.length);
  Pts = [];
  console.log("AFTER: Pts.length = " + Pts.length);
  var fileList = this.files; /* now you can work with the file list */

  // function handleImage(e) {
  var reader = new FileReader();
  reader.onload = function(event) {
    var img = new Image();
    img.onload = function() {
      c.width = img.width;
      c.height = img.height;
      ctx.drawImage(img, 0, 0);
    }
    img.src = event.target.result;
  }
  reader.readAsDataURL(e.target.files[0]);
}

$('#vertical').change(function() {
  if ($(this).is(":checked")) {
    $('#horizontal').attr('checked', false);
    console.log("vert changed");
    vertBool = true;
    horzBool = false;
  }
});

$('#horizontal').change(function() {
  if ($(this).is(":checked")) {
    $('#vertical').attr('checked', false);
    console.log("horz changed");
    vertBool = false;
    horzBool = true;
  }
});

// immediately invoked function
(function() {
  area = document.getElementById("canvas");
  area.addEventListener("click", function(e) {
    getPosition(e);
  });
})();

var pointSize = 3;

function getPosition(event) {
  console.log("running getPosition()");
  var rect = canvas.getBoundingClientRect();

  var x = event.clientX - rect.left; // x == the location of the click in the document - the location (relative to the left) of the canvas in the document
  var y = event.clientY - rect.top; // y == the location of the click in the document - the location (relative to the top) of the canvas in the document

  console.log("in getPosition(): vertBool is: " + vertBool);
  console.log("in getPosition(): horzBool is: " + horzBool);

  Pts.push({
    x: x,
    y: y
  });
  //constraints
  if (Pts.length % 2 == 0) {
    if (vertBool) {
      Pts[Pts.length - 1].x = Pts[Pts.length - 2].x;
      // reset x
      x = Pts[Pts.length - 1].x;
    }
    if (horzBool) {
      Pts[Pts.length - 1].y = Pts[Pts.length - 2].y;
      //reste y
      y = Pts[Pts.length - 1].y;
    }
  }

  console.log("Pts.length = " + Pts.length);
  drawCoordinates(x, y);

  // Every time an even number of points created
  if (Pts.length % 2 == 0) {
    drawLine(Pts[Pts.length - 2].x, Pts[Pts.length - 2].y, Pts[Pts.length - 1].x, Pts[Pts.length - 1].y);
    addInput(Pts[Pts.length - 2].x, Pts[Pts.length - 2].y);
  };
  console.log(Pts);
}

function drawCoordinates(x, y) {
  console.log("running drawCoordinates()");
  var pointSize = 3; // Change according to the size of the point.
  var ctx = document.getElementById("canvas").getContext("2d");
  if (Pts.length < 3) {
    ctx.fillStyle = "white";
    // ctx.fillStyle = "blue"; // Red color
  } else {
    ctx.fillStyle = "white";
    // ctx.fillStyle = "red"; // Red color
  }
  ctx.beginPath(); //Start path
  ctx.arc(x, y, pointSize, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
  ctx.fill(); // Close the path and fill.
}

function drawLine(x1, y1, x2, y2) {
  console.log("running drawLine()");
  var ctx = document.getElementById("canvas").getContext("2d");
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  if (Pts.length < 3) {
    ctx.strokeStyle = 'white';
    // ctx.strokeStyle = 'blue';
  } else {
    ctx.strokeStyle = 'white';
    // ctx.strokeStyle = 'black';
  }
  ctx.stroke();
}

function addInput(x, y) {
  console.log("running addInput()");
  // var newDiv = document.createElement('div');

  var input = document.createElement('input');
  input.type = 'text';
  input.name = 'item';
  if (Pts.length == 2) {
    input.placeholder = "reference distance";
  } else {
    input.placeholder = "dimension name"
  }
  input.style.position = 'fixed';
  input.style.left = (x + 4) + 'px';
  input.style.top = (y + 4) + 'px';
  input.onkeydown = handleEnter;
  document.body.appendChild(input);
  input.focus();
  hasInput = true;
}

function handleEnter(e) {
  console.log("running handleEnter()");
  var keyCode = e.keyCode;
  if (keyCode === 13) {
    getDistance();

    inputValue = this.value; // input ratio or variable name
    Pts[Pts.length - 1].name = this.value;
    Pts[Pts.length - 1].dist = (ratio * dist).toFixed(0);
    document.body.removeChild(this);
    hasInput = false;

    updateObject(); // add variable or line name to object
    console.log("name: " + Pts[Pts.length - 1].name);
    console.log(Pts);
    // getDistance();
    console.log("Dist: " + dist);

    if (Pts.length == 2) {
      console.log("inputValue: " + inputValue);
      console.log("dist: " + dist + "m");

      ratio = inputValue / dist; // ratio only set once
      console.log("ratio: " + ratio);
      txt = "reference line = " + (dist * ratio).toFixed(0) + "m";
    } else {
      console.log("name: " + Pts[Pts.length - 1].name);
      txt = Pts[Pts.length - 1].name + " = " + (dist * ratio).toFixed(0) + "m";
    }
    console.log("txt: " + txt);
    drawText(txt, Pts[Pts.length - 2].x, Pts[Pts.length - 2].y, Pts[Pts.length - 1].x, Pts[Pts.length - 1].y);
  }
}

function getDistance() {
  console.log("running getDistance()");
  dist = Math.sqrt(Math.pow(Math.abs(Pts[Pts.length - 2].x - Pts[Pts.length - 1].x), 2) + Math.pow(Math.abs(Pts[Pts.length - 2].y -
    Pts[Pts.length - 1].y), 2));
  return dist
}

function updateObject() {
  console.log("running updateObject(), Pts.length = " + Pts.length);
  if (Pts.length > 2) {
    console.log("length: " + Pts.length);
    Pts[Pts.length - 1].name = inputValue;
    for (i = 0; i < Pts.length; i++) {
      console.log("updateObject(): i = " + i + ", Pts[i].name = " + Pts[i].name + ", Pts[i].dist = " + Pts[i].dist);
    }
  }
}

function drawText(txt, x1, y1, x2, y2) {
  console.log("running drawText()");
  // (x,y) coordinate of text mid way between both points
  x = ((x2 + x1) / 2) + 5;
  y = ((y2 + y1) / 2) + 5;
  var ctx = document.getElementById("canvas").getContext("2d");
  ctx.save();
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  // ctx.font = font;
  ctx.font = '20px serif';
  // angle = Math.atan((Math.abs(y2 - y1)) / (Math.abs(x2 - x1)));
  // console.log(angle);
  ctx.translate(x, y)
  // ctx.rotate(-1 * angle);
  ctx.fillText(txt, 0, 0);
  ctx.restore();
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText(txt, 10, Pts.length * 7);
  old_html = document.getElementById("dimensions").innerHTML;
  document.getElementById("dimensions").innerHTML = old_html + "<br>" + txt;
}

function createSCAD() {
  var fileContent = "";
  for (var i = 3; i < Pts.length; i += 2) {
    fileContent += Pts[i].name + " = " + Pts[i].dist + ";\r\n";
  }
  var file = new File([fileContent], "file.scad", {
    type: "text/plain;charset=utf-8"
  });
  saveAs(file);
}

function createtxt() {
  var fileContent = "";
  for (var i = 3; i < Pts.length; i += 2) {
    fileContent += Pts[i].name + " = " + Pts[i].dist + "\r\n";
  }
  var file = new File([fileContent], "file.txt", {
    type: "text/plain;charset=utf-8"
  });
  saveAs(file);
}

function clearCanvas() {
  ctx.clearRect(0, 0, c.width, c.height);
}

function download_image() {
  // Dump the canvas contents to a file.
  var canvas = document.getElementById("canvas");
  var today = new Date();
  var date = today.getFullYear() + "" + (today.getMonth() + 1) + "" + "" + today.getDate() + "" + (today.getHours() - 2) + "" + today.getMinutes() + "" + today.getSeconds();
  today.getDate();
  canvas.toBlob(function(blob) {
    saveAs(blob, date + "Canvas.png");
  }, "image/png");
};