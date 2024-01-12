/*
https://en.wikipedia.org/wiki/Sobel_operator
https://homepages.inf.ed.ac.uk/rbf/HIPR2/log.htm#:~:text=The%20Laplacian%20is%20a%202,see%20zero%20crossing%20edge%20detectors).
https://en.wikipedia.org/wiki/Kernel_(image_processing)
https://thewebdev.info/2020/04/28/chart-js-create-a-histogram/
*/
//dobimo sliko na canvas
/* let img = document.getElementById('slika');
img.style.width = "640px";
img.style.height = "853px";
/* ctx.drawImage(img,0,0);
ctx2.drawImage(img,0,0);
document.body.removeChild(img); */

let imageLoader = document.getElementById('uploader');
imageLoader.addEventListener('change', handleImage);
//drawing flags
let isDrawing = false;
let Draw = false;
let lastX = 0;
let lastY = 0;

//undo/redo flags
let currentPos = 0;
let versions = [0,0,0,0,0,0,0,0,0,0];

function saveVersion(imgDataset){
  console.log(currentPos);
  if(currentPos == 9)
    currentPos = 9; //vem da je dumb, ampak dela
  else
    currentPos++;
  if(currentPos != 0)
    document.getElementById('undo-button').style.opacity = '1';
  else
    document.getElementById('undo-button').style.opacity = '0.3';

  if(currentPos != 9)
    document.getElementById('redo-button').style.opacity = '1';
  else
    document.getElementById('redo-button').style.opacity = '0.3';
  let newData = new Uint8ClampedArray(imgDataset.data.length);
  for(let i = 0;i<imgDataset.data.length;i+=4){
    newData[i] = imgDataset.data[i];
    newData[i+1] = imgDataset.data[i+1];
    newData[i+2] = imgDataset.data[i+2];
    newData[i+3] = imgDataset.data[i+3];
  }
  versions[currentPos] = newData;  
}

function draw(e){
  let c = document.getElementById('canvas');
  let c2 = document.getElementById('canvas2');
  let ctx = c.getContext('2d');
  let ctx2 = c2.getContext('2d');
  ctx.lineJoin = ctx.lineCap = 'round';
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#ffffff';
  if(!isDrawing){
    return;
  }
  ctx.beginPath();
  ctx.moveTo(lastX,lastY);
  ctx.lineTo((e.offsetX + document.getElementById('canvas').offsetLeft)*4 - 500,(e.offsetY + document.getElementById('canvas').offsetTop)*6);
  ctx.stroke();
  [lastX,lastY]=[(e.offsetX + document.getElementById('canvas').offsetLeft)*4 - 500,(e.offsetY + document.getElementById('canvas').offsetTop)*6];
}

function handleImage(e){
    canvas = document.createElement('canvas');
    canvas2 = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas2.id = 'canvas2';
    document.getElementsByClassName('container-body')[0].appendChild(canvas);
    document.getElementsByClassName('container-body')[0].appendChild(canvas2);
    let c = document.getElementById('canvas');
    let c2 = document.getElementById('canvas2');
    let ctx = c.getContext('2d');
    let ctx2 = c2.getContext('2d');
    let reader = new FileReader();
    reader.onload = function(event){
        let img = new Image();
        img.onload = function(){
            c.width = img.width;
            c.height = img.height;
            c2.width = img.width;
            c2.height = img.height;
            ctx.drawImage(img,0,0);
            ctx2.drawImage(img,0,0);
            if(img.width >= img.height){
              document.getElementsByClassName('container-body')[0].style.flexDirection = "column";
            }
            else{
              document.getElementsByClassName('container-body')[0].style.flexDirection = "row";              
            }
                //inicializira prvotni dataset
                let imgData = ctx.getImageData(0,0, c2.width, c2.height);
                let newData = new Uint8ClampedArray(imgData.data.length);
                for(let i = 0;i<imgData.data.length;i+=4){
                  newData[i] = imgData.data[i];
                  newData[i+1] = imgData.data[i+1];
                  newData[i+2] = imgData.data[i+2];
                  newData[i+3] = imgData.data[i+3];
                }
                versions[0] = newData;   
                versions[1] = newData;   
                versions[2] = newData;   
                versions[3] = newData;   
                versions[4] = newData;   
                versions[5] = newData;   
                versions[6] = newData;   
                versions[7] = newData;   
                versions[8] = newData;   
                versions[9] = newData;   
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);  
    document.getElementById('save-button').style.opacity = '1';
    document.getElementById('paint-button').style.opacity = '1';
    document.getElementById('save-button').addEventListener('click', function save(){
      let link = document.createElement('a');
      link.download = 'download.png';
      link.href = canvas.toDataURL();
      link.click();
      link.delete;  
    });

    document.getElementById('undo-button').addEventListener('click', function undo(){
      if(currentPos != 0){
        currentPos--;
        let imgData = ctx.getImageData(0,0, c2.width, c2.height);
        let newData = new Uint8ClampedArray(imgData.data.length);
        for(let i = 0;i<imgData.data.length;i+=4){
          newData[i] = versions[currentPos][i];
          newData[i+1] = versions[currentPos][i+1];
          newData[i+2] = versions[currentPos][i+2];
          newData[i+3] = versions[currentPos][i+3];
        }
        imgData.data.set(newData);
        ctx.putImageData(imgData,0,0);
      }
    });

    document.getElementById('redo-button').addEventListener('click', function redo(){
      if(currentPos != 9){
        currentPos++;
        let imgData = ctx.getImageData(0,0, c2.width, c2.height);
        let newData = new Uint8ClampedArray(imgData.data.length);
        for(let i = 0;i<imgData.data.length;i+=4){
          newData[i] = versions[currentPos][i];
          newData[i+1] = versions[currentPos][i+1];
          newData[i+2] = versions[currentPos][i+2];
          newData[i+3] = versions[currentPos][i+3];
        }
        imgData.data.set(newData);
        ctx.putImageData(imgData,0,0);
      }
    });

  document.getElementById('canvas').addEventListener('mousedown',(e)=>{
      if(Draw)
        isDrawing = true;
      else
        isDrawing = false;
      [lastX, lastY] = [(e.offsetX + document.getElementById('canvas').offsetLeft)*4 - 500,(e.offsetY + document.getElementById('canvas').offsetTop)*6];
    });
  document.getElementById('canvas').addEventListener('mousemove', draw);
  document.getElementById('paint-button').addEventListener('click', () => {
    Draw = !Draw;
    if(Draw)
      document.getElementById('paint-button').style.backgroundColor = '#ED1C24';
    else
      document.getElementById('paint-button').style.backgroundColor = null;
  });
}

function histrogram(){
  let c = document.getElementById('canvas');
  let c2 = document.getElementById('canvas2');
  let ctx = c.getContext('2d');
  let ctx2 = c2.getContext('2d');
  let img_width = c2.width;
  let img_height = c2.height;
  let imgData = ctx.getImageData(0,0, c2.width, c2.height);
  let color = "red";
  let labels = [];
  let dataset = [];

  for(let j = 0; j<document.getElementById("odsek").value;j++){
    labels[j] = "" + Math.round((255/document.getElementById("odsek").value)*j) + " - " + Math.round((255/document.getElementById("odsek").value)*(j+1));
    dataset[j] = 0;
  }

  for(let i = 0;i<imgData.data.length;i+=4){
    if(document.getElementById("barva0").checked){
      color = "red";
      for(let j = 0; j<document.getElementById("odsek").value;j++){
        if(imgData.data[i] >= Math.round((255/document.getElementById("odsek").value)*j) && imgData.data[i] < Math.round((255/document.getElementById("odsek").value)*(j+1))){
          dataset[j] = dataset[j] + 1;
        }
      }
    }
    else if(document.getElementById("barva1").checked){
      color = "green";
      for(let j = 0; j<document.getElementById("odsek").value;j++){
        if(imgData.data[i+1] >= Math.round((255/document.getElementById("odsek").value)*j) && imgData.data[i+1] < Math.round((255/document.getElementById("odsek").value)*(j+1)))
          dataset[j] = dataset[j] + 1;       
      }
    }
    else if(document.getElementById("barva2").checked){
      color = "blue";
      for(let j = 0; j<document.getElementById("odsek").value;j++){
        if(imgData.data[i+2] >= Math.round((255/document.getElementById("odsek").value)*j) && imgData.data[i+2] < Math.round((255/document.getElementById("odsek").value)*(j+1)))
          dataset[j] = dataset[j] + 1;       
      }
    }
    imgData.data[i];
    imgData.data[i+1];
    imgData.data[i+2];
    imgData.data[i+3];
  }
  ctx.putImageData(imgData,0,0);

  new Chart("canvas", {
  type: 'bar',
  data: {
    labels: labels,
    datasets: [{
      label: 'Stevilo intenzitet',
      data: dataset,
      backgroundColor: color,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      xAxes: [{
        display: false,
        barPercentage: 1.3,
        ticks: {
          max: 3,
        }
      }, {
        display: true,
        ticks: {
          autoSkip: false,
          max: 4,
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});
/* c.width = c2.width;
c.height = c2.height; */
c.style.width = null;
c.style.height = null;
document.getElementsByClassName('container-body')[0].style.flexDirection = 'row';
document.getElementById('canvas').style.width = '70%';
document.getElementById('canvas').style.height = '70%';
}

//konvolucijo s skatlastim jedrom (box blur)
//[1 1 1]         [plz pz pdz]
//[1 1 1] * 1/9   [pl px pd]
//[1 1 1]         [pls ps pds]
function boxBlur(){
  reset();
  let c = document.getElementById('canvas');
  let c2 = document.getElementById('canvas2');
  let ctx = c.getContext('2d');
  let ctx2 = c2.getContext('2d');
  let img_width = c2.width;
  let img_height = c2.height;
  let imgData = ctx.getImageData(0,0, c2.width, c2.height);
  let blurData = new Uint8ClampedArray(imgData.data.length);
  for(let x = 1;x<img_width-1;x++){
    for(let y = 1;y<img_height-1;y++){
      for(let k = 0;k<4;k++){
        let plz = ((y-1) * img_width * 4) +((x-1)*4);
        let pz = ((y-1) * img_width * 4) +(x*4);
        let pdz = ((y-1) * img_width * 4) +((x+1)*4);
        let pl = (y * img_width * 4) +((x-1)*4);
        let px = (y * img_width * 4) +(x*4);
        let pd = (y * img_width * 4) +((x+1)*4);
        let pls = ((y+1) * img_width * 4) +((x-1)*4);
        let ps = ((y+1) * img_width * 4) +(x*4);
        let pds = ((y+1) * img_width * 4) +((x+1)*4);
        let piksel = imgData.data[plz+k] + imgData.data[pz+k] + imgData.data[pdz+k] + imgData.data[pl+k] + imgData.data[px+k] + imgData.data[pd+k] + imgData.data[pls+k] + imgData.data[ps+k] + imgData.data[pds+k];
        piksel = Math.round(piksel*(1/9));
        if(piksel > 255)
          piksel = 255;
        else if(piksel < 0)
          piksel = 0;
        if(k != 3)
          blurData[px+k] = piksel;
        else
          blurData[px+3] = imgData.data[px+3];
      }
    }
  }
  imgData.data.set(blurData);
  ctx.putImageData(imgData,0,0);
  saveVersion(blurData);
}

//konvolucijo z gladkim jedrom (gaussian blur) 3x3
//[1 2 1]           [plz pz pdz]
//[2 4 2] * 1/16    [pl px pd]
//[1 2 1]           [pls ps pds]
function gaussianBlur(){
  reset();
  let c = document.getElementById('canvas');
  let c2 = document.getElementById('canvas2');
  let ctx = c.getContext('2d');
  let ctx2 = c2.getContext('2d');
  let img_width = c2.width;
  let img_height = c2.height;
  let imgData = ctx.getImageData(0,0, c2.width, c2.height);
  //koncni podatki za sliko
  let gaussianData = new Uint8ClampedArray(imgData.data.length);
  for(let x = 1;x<img_width-1;x++){
    for(let y = 1;y<img_height-1;y++){
      for(let k = 0;k<4;k++){
        let plz = ((y-1) * img_width * 4) +((x-1)*4);
        let pz = ((y-1) * img_width * 4) +(x*4);
        let pdz = ((y-1) * img_width * 4) +((x+1)*4);
        let pl = (y * img_width * 4) +((x-1)*4);
        let px = (y * img_width * 4) +(x*4);
        let pd = (y * img_width * 4) +((x+1)*4);
        let pls = ((y+1) * img_width * 4) +((x-1)*4);
        let ps = ((y+1) * img_width * 4) +(x*4);
        let pds = ((y+1) * img_width * 4) +((x+1)*4);
        let piksel = imgData.data[plz+k] + imgData.data[pz+k]*2 + imgData.data[pdz+k] + imgData.data[pl+k]*2 + imgData.data[px+k]*4 + imgData.data[pd+k]*2 + imgData.data[pls+k] + imgData.data[ps+k]*2 + imgData.data[pds+k];
        piksel = Math.round(piksel*(1/16));
        if(piksel > 255)
          piksel = 255;
        else if(piksel < 0)
          piksel = 0;
        if(k != 3)
          gaussianData[px+k] = piksel;
        else
          gaussianData[px+3] = imgData.data[px+3];
      }
    }
  }
  imgData.data.set(gaussianData);
  ctx.putImageData(imgData,0,0);
  saveVersion(gaussianData);
}

//iskanje robov s Sobelovim operatorjem
//[1 0 -1]
//[2 0 -2] = Gx (horizontalne linije)
//[1 0 -1] 
//in pa
//[1 2 1]
//[0 0 0] = Gy (vertikalne linije)
//[-1 -2 -1] 
//
//[plz pz pdz]
//[pl px pd]
//[pls ps pds]
/*Gx*/
function sobelHorizontal(){
  reset();
  let c = document.getElementById('canvas');
  let c2 = document.getElementById('canvas2');
  let ctx = c.getContext('2d');
  let ctx2 = c2.getContext('2d');
  let img_width = c2.width;
  let img_height = c2.height;
  let imgData = ctx.getImageData(0,0, c2.width, c2.height);
  //ustvarimo nov tok podatkov
  let sobelData = new Uint8ClampedArray(imgData.data.length);
  for(let x = 1;x<img_width-1;x++){
    for(let y = 1;y<img_height-1;y++){
      //za vsak barvni kanal posebej
      for(let k = 0;k<4;k++){
        //koordinate pikslov, ki se bodo uporabili v kernel-u
        let plz = ((y-1) * img_width * 4) +((x-1)*4);
        let pz = ((y-1) * img_width * 4) +(x*4);
        let pdz = ((y-1) * img_width * 4) +((x+1)*4);
        let pl = (y * img_width * 4) +((x-1)*4);
        let px = (y * img_width * 4) +(x*4);
        let pd = (y * img_width * 4) +((x+1)*4);
        let pls = ((y+1) * img_width * 4) +((x-1)*4);
        let ps = ((y+1) * img_width * 4) +(x*4);
        let pds = ((y+1) * img_width * 4) +((x+1)*4);
        //vrednost piksla
        let piksel = imgData.data[plz+k] + imgData.data[pz+k]*0 + imgData.data[pdz+k]*(-1) + imgData.data[pl+k]*2 + imgData.data[px+k]*0 + imgData.data[pd+k]*(-2) + imgData.data[pls+k] + imgData.data[ps+k]*0 + imgData.data[pds+k]*(-1);
        //vrednost piksla omejimo med 0 in 255
        if(piksel > 255)
          piksel = 255;
        else if(piksel < 0)
          piksel = 0;
        //vrednost piksla zapisemo v sobelData, vrednost alpha samo prepisemo iz originalnih podatkov
        if(k != 3)
          sobelData[px+k] = piksel;
        else
          sobelData[px+3] = imgData.data[px+3];
      }
    }
  }
  imgData.data.set(sobelData);
  ctx.putImageData(imgData,0,0);
  saveVersion(sobelData);
}

/*Gy*/
function sobelVertical(){
  reset();
  let c = document.getElementById('canvas');
  let c2 = document.getElementById('canvas2');
  let ctx = c.getContext('2d');
  let ctx2 = c2.getContext('2d');
  let img_width = c2.width;
  let img_height = c2.height;
  //originalni podatki
  let imgData = ctx.getImageData(0,0, c2.width, c2.height);
  //podatki za sobel, ne spreminjamo piksle originalne slike, ker vpliva na nadaljno racunanje
  let sobelData = new Uint8ClampedArray(imgData.data.length);
  for(let x = 1;x<img_width-1;x++){
    for(let y = 1;y<img_height-1;y++){
      //za vsak barvni kanal posebej
      for(let k = 0;k<4;k++){
        //koordinate pikslov, ki se bodo uporabili v kernel-u
        let plz = ((y-1) * img_width * 4) +((x-1)*4);
        let pz = ((y-1) * img_width * 4) +(x*4);
        let pdz = ((y-1) * img_width * 4) +((x+1)*4);
        let pl = (y * img_width * 4) +((x-1)*4);
        let px = (y * img_width * 4) +(x*4);
        let pd = (y * img_width * 4) +((x+1)*4);
        let pls = ((y+1) * img_width * 4) +((x-1)*4);
        let ps = ((y+1) * img_width * 4) +(x*4);
        let pds = ((y+1) * img_width * 4) +((x+1)*4);
        //vrednost piksla
        let piksel = imgData.data[plz+k] + imgData.data[pz+k]*2 + imgData.data[pdz+k] + imgData.data[pl+k]*0 + imgData.data[px+k]*0 + imgData.data[pd+k]*0 + imgData.data[pls+k]*(-1) + imgData.data[ps+k]*(-2) + imgData.data[pds+k]*(-1);
        //omejimo vrednosti piksla med 0 in 255
        if(piksel > 255)
          piksel = 255;
        else if(piksel < 0)
          piksel = 0;
        //piksel damo v podatke za sobel, vrednost alpha samo prepisemo iz originalnih podatkov
        if(k != 3)
          sobelData[px + k] = piksel;
        else
          sobelData[px+3] = imgData.data[px+3];
      }
    }
  }
  //sobelov operator nadomestimo z originalnim
  imgData.data.set(sobelData);
  ctx.putImageData(imgData,0,0);
  saveVersion(sobelData);
}

/*Gx in Gy skupaj (dobimo sliko z vsemi robovi (vodoravnimi in navpicnimi))
G = sqrt(pow(Gx,2) + pow(Gy,2)) */
function sobelCombined(){
  reset();
  let c = document.getElementById('canvas');
  let c2 = document.getElementById('canvas2');
  let ctx = c.getContext('2d');
  let ctx2 = c2.getContext('2d');
  let img_width = c2.width;
  let img_height = c2.height;
  //originalni podatki
  let imgData = ctx.getImageData(0,0, c2.width, c2.height);
  //podatki koncne slike
  let sobelData = new Uint8ClampedArray(imgData.data.length);
  for(let x = 1;x<img_width-1;x++){
    for(let y = 1;y<img_height-1;y++){
      //za vsak barvni kanal posebej
      for(let k = 0;k<4;k++){
        //koordinate pikslov, ki se bodo uporabili v kernel-u
        let plz = ((y-1) * img_width * 4) +((x-1)*4);
        let pz = ((y-1) * img_width * 4) +(x*4);
        let pdz = ((y-1) * img_width * 4) +((x+1)*4);
        let pl = (y * img_width * 4) +((x-1)*4);
        let px = (y * img_width * 4) +(x*4);
        let pd = (y * img_width * 4) +((x+1)*4);
        let pls = ((y+1) * img_width * 4) +((x-1)*4);
        let ps = ((y+1) * img_width * 4) +(x*4);
        let pds = ((y+1) * img_width * 4) +((x+1)*4);
        //vrednost pikslov x in y
        let piksel_y = imgData.data[plz+k] + imgData.data[pz+k]*2 + imgData.data[pdz+k] + imgData.data[pl+k]*0 + imgData.data[px+k]*0 + imgData.data[pd+k]*0 + imgData.data[pls+k]*(-1) + imgData.data[ps+k]*(-2) + imgData.data[pds+k]*(-1);
        let piksel_x = imgData.data[plz+k] + imgData.data[pz+k]*0 + imgData.data[pdz+k]*(-1) + imgData.data[pl+k]*2 + imgData.data[px+k]*0 + imgData.data[pd+k]*(-2) + imgData.data[pls+k] + imgData.data[ps+k]*0 + imgData.data[pds+k]*(-1);
        //omejimo vrednosti pikslov med 0 in 255
        if(piksel_y > 255)
          piksel_y = 255;
        else if(piksel_y < 0)
          piksel_y = 0;
        else if(piksel_x > 255)
          piksel_x = 255;
        else if(piksel_x < 0)
          piksel_x = 0;
        //piksel damo v podatke za sobel, vrednost alpha samo prepisemo iz originalnih podatkov
        if(k != 3)
          sobelData[px + k] = Math.sqrt(Math.pow(piksel_x,2) + Math.pow(piksel_y,2));
        else
          sobelData[px+3] = imgData.data[px+3];
      }
    }
  }
  //sobelov operator nadomestimo z originalnim
  imgData.data.set(sobelData);
  ctx.putImageData(imgData,0,0);
  saveVersion(sobelData);
}

//iskanje robov z Laplaceovim operatorjem
//[plz pz pdz]
//[pl px pd]
//[pls ps pds]
/*
[0 -1 0]
[-1 4 -1]
[0 -1 0] 
*/
function laplace1(){
  reset();
  let c = document.getElementById('canvas');
  let c2 = document.getElementById('canvas2');
  let ctx = c.getContext('2d');
  let ctx2 = c2.getContext('2d');
  let img_width = c2.width;
  let img_height = c2.height;
  //originalni podatki
  let imgData = ctx.getImageData(0,0, c2.width, c2.height);
  //podatki za laplace
  let laplaceData = new Uint8ClampedArray(imgData.data.length);
  for(let x = 1;x<img_width-1;x++){
    for(let y = 1;y<img_height-1;y++){
      //za vsak barvni kanal posebej
      for(let k = 0;k<4;k++){
        //koordinate pikslov, ki se bodo uporabili v kernel-u
        let plz = ((y-1) * img_width * 4) +((x-1)*4);
        let pz = ((y-1) * img_width * 4) +(x*4);
        let pdz = ((y-1) * img_width * 4) +((x+1)*4);
        let pl = (y * img_width * 4) +((x-1)*4);
        let px = (y * img_width * 4) +(x*4);
        let pd = (y * img_width * 4) +((x+1)*4);
        let pls = ((y+1) * img_width * 4) +((x-1)*4);
        let ps = ((y+1) * img_width * 4) +(x*4);
        let pds = ((y+1) * img_width * 4) +((x+1)*4);
        //vrednost piksla
        let piksel = imgData.data[plz+k]*0 + imgData.data[pz+k]*(-1) + imgData.data[pdz+k]*0 + imgData.data[pl+k]*(-1) + imgData.data[px+k]*4 + imgData.data[pd+k]*(-1) + imgData.data[pls+k]*0 + imgData.data[ps+k]*(-1) + imgData.data[pds+k]*0;
        //omejimo vrednosti piksla med 0 in 255
        if(piksel > 255)
          piksel = 255;
        else if(piksel < 0)
          piksel = 0;
        //piksel damo v podatke za laplace, vrednost alpha samo prepisemo iz originalnih podatkov
        if(k != 3)
          laplaceData[px + k] = piksel;
        else
          laplaceData[px+3] = imgData.data[px+3];
      }
    }
  }
  //laplace-ov operator nadomestimo z originalnim
  imgData.data.set(laplaceData);
  ctx.putImageData(imgData,0,0);
  saveVersion(laplaceData);
}

/*
[-1 -1 -1]
[-1 8 -1]
[-1 -1 -1] 
*/
function laplace2(){
  reset();
  let c = document.getElementById('canvas');
  let c2 = document.getElementById('canvas2');
  let ctx = c.getContext('2d');
  let ctx2 = c2.getContext('2d');
  let img_width = c2.width;
  let img_height = c2.height;
  //originalni podatki
  let imgData = ctx.getImageData(0,0, c2.width, c2.height);
  //podatki za laplace
  let laplaceData = new Uint8ClampedArray(imgData.data.length);
  for(let x = 1;x<img_width-1;x++){
    for(let y = 1;y<img_height-1;y++){
      //za vsak barvni kanal posebej
      for(let k = 0;k<4;k++){
        //koordinate pikslov, ki se bodo uporabili v kernel-u
        let plz = ((y-1) * img_width * 4) +((x-1)*4);
        let pz = ((y-1) * img_width * 4) +(x*4);
        let pdz = ((y-1) * img_width * 4) +((x+1)*4);
        let pl = (y * img_width * 4) +((x-1)*4);
        let px = (y * img_width * 4) +(x*4);
        let pd = (y * img_width * 4) +((x+1)*4);
        let pls = ((y+1) * img_width * 4) +((x-1)*4);
        let ps = ((y+1) * img_width * 4) +(x*4);
        let pds = ((y+1) * img_width * 4) +((x+1)*4);
        //vrednost piksla
        let piksel = imgData.data[plz+k]*(-1) + imgData.data[pz+k]*(-1) + imgData.data[pdz+k]*(-1) + imgData.data[pl+k]*(-1) + imgData.data[px+k]*8 + imgData.data[pd+k]*(-1) + imgData.data[pls+k]*(-1) + imgData.data[ps+k]*(-1) + imgData.data[pds+k]*(-1);
        //omejimo vrednosti piksla med 0 in 255
        if(piksel > 255)
          piksel = 255;
        else if(piksel < 0)
          piksel = 0;
        //piksel damo v podatke za laplace, vrednost alpha samo prepisemo iz originalnih podatkov
        if(k != 3)
          laplaceData[px + k] = piksel;
        else
          laplaceData[px+3] = imgData.data[px+3];
      }
    }
  }
  //laplace-ov operator nadomestimo z originalnim
  imgData.data.set(laplaceData);
  ctx.putImageData(imgData,0,0);
  saveVersion(laplaceData);
}

//konvolucijo z ostrenjem in neostrenjem (sharpening and unsharpening mask)
//sharpening (laplace-ov operator na sliko, nato pristejemo originalno sliko in laplace)
function sharpeningFunction(){
  reset();
  let c = document.getElementById('canvas');
  let c2 = document.getElementById('canvas2');
  let ctx = c.getContext('2d');
  let ctx2 = c2.getContext('2d');
  let img_width = c2.width;
  let img_height = c2.height;
  //originalni podatki
  let imgData = ctx.getImageData(0,0, c2.width, c2.height);
  //podatki za sharpening
  let sharpeningData = new Uint8ClampedArray(imgData.data.length);
  for(let x = 1;x<img_width-1;x++){
    for(let y = 1;y<img_height-1;y++){
      //za vsak barvni kanal posebej
      for(let k = 0;k<4;k++){
        //koordinate pikslov, ki se bodo uporabili v kernel-u
        let plz = ((y-1) * img_width * 4) +((x-1)*4);
        let pz = ((y-1) * img_width * 4) +(x*4);
        let pdz = ((y-1) * img_width * 4) +((x+1)*4);
        let pl = (y * img_width * 4) +((x-1)*4);
        let px = (y * img_width * 4) +(x*4);
        let pd = (y * img_width * 4) +((x+1)*4);
        let pls = ((y+1) * img_width * 4) +((x-1)*4);
        let ps = ((y+1) * img_width * 4) +(x*4);
        let pds = ((y+1) * img_width * 4) +((x+1)*4);
        //vrednost piksla
        let piksel = imgData.data[plz+k]*(-1) + imgData.data[pz+k]*(-1) + imgData.data[pdz+k]*(-1) + imgData.data[pl+k]*(-1) + imgData.data[px+k]*8 + imgData.data[pd+k]*(-1) + imgData.data[pls+k]*(-1) + imgData.data[ps+k]*(-1) + imgData.data[pds+k]*(-1);
        //omejimo vrednosti piksla med 0 in 255
        if(piksel > 255)
          piksel = 255;
        else if(piksel < 0)
          piksel = 0;
        //piksel damo v podatke za sharpening, vrednost alpha samo prepisemo iz originalnih podatkov
        if(k != 3)
          sharpeningData[px + k] = imgData.data[px + k] + piksel; //ce delis piksel z n, dobis intenziteto sharpening-a (iz tega lahko naredis slider za user-ja)
        else
          sharpeningData[px+3] = imgData.data[px+3];
      }
    }
  }
  //sharpening nadomestimo z originalnim
  imgData.data.set(sharpeningData);
  ctx.putImageData(imgData,0,0);
  saveVersion(sharpeningData);
}

//unsharpening mask (sliki odstejemo zglajeno sliko (Box blur), nato rezultat pristejemo originalu)
function unsharpeningMask(){
  reset();
  let c = document.getElementById('canvas');
  let c2 = document.getElementById('canvas2');
  let ctx = c.getContext('2d');
  let ctx2 = c2.getContext('2d');
  let img_width = c2.width;
  let img_height = c2.height;
  //originalni podatki
  let imgData = ctx.getImageData(0,0, c2.width, c2.height);
  //podatki za sharpening
  let unsharpeningData = new Uint8ClampedArray(imgData.data.length);
  for(let x = 1;x<img_width-1;x++){
    for(let y = 1;y<img_height-1;y++){
      //za vsak barvni kanal posebej
      for(let k = 0;k<4;k++){
        //koordinate pikslov, ki se bodo uporabili v kernel-u
        let plz = ((y-1) * img_width * 4) +((x-1)*4);
        let pz = ((y-1) * img_width * 4) +(x*4);
        let pdz = ((y-1) * img_width * 4) +((x+1)*4);
        let pl = (y * img_width * 4) +((x-1)*4);
        let px = (y * img_width * 4) +(x*4);
        let pd = (y * img_width * 4) +((x+1)*4);
        let pls = ((y+1) * img_width * 4) +((x-1)*4);
        let ps = ((y+1) * img_width * 4) +(x*4);
        let pds = ((y+1) * img_width * 4) +((x+1)*4);
        //vrednost piksla
        let piksel = imgData.data[plz+k] + imgData.data[pz+k] + imgData.data[pdz+k] + imgData.data[pl+k] + imgData.data[px+k] + imgData.data[pd+k] + imgData.data[pls+k] + imgData.data[ps+k] + imgData.data[pds+k];
        piksel = Math.round(piksel*(1/9));
        //omejimo vrednosti piksla med 0 in 255
        if(piksel > 255)
          piksel = 255;
        else if(piksel < 0)
          piksel = 0;
        //piksel damo v podatke za sharpening, vrednost alpha samo prepisemo iz originalnih podatkov
        if(k != 3)
          unsharpeningData[px + k] = imgData.data[px + k] + (imgData.data[px + k] - piksel);
        else
          unsharpeningData[px+3] = imgData.data[px+3];
      }
    }
  }
  //sharpening nadomestimo z originalnim
  imgData.data.set(unsharpeningData);
  ctx.putImageData(imgData,0,0);
  saveVersion(unsharpeningData);
}

function reset(){
  let c = document.getElementById('canvas');
  let c2 = document.getElementById('canvas2');
  let ctx = c.getContext('2d');
  let ctx2 = c2.getContext('2d');  
  let imgData = ctx2.getImageData(0,0, c2.width, c2.height);  
  ctx.putImageData(imgData,0,0); 
  document.getElementById('vrednost').innerHTML = "1";
}

//sivinska fotografija
function sivenje(){
  reset();
  let c = document.getElementById('canvas');
  let c2 = document.getElementById('canvas2');
  let ctx = c.getContext('2d');
  let ctx2 = c2.getContext('2d');
  let imgData = ctx.getImageData(0,0, c2.width, c2.height);
  for(let i = 0;i<imgData.data.length;i+=4){
    let piksel = 0.299*imgData.data[i] + 0.587*imgData.data[i+1] + 0.114*imgData.data[i+2];
    let alpha = imgData.data[i+3]
    imgData.data[i] = piksel;
    imgData.data[i+1] = piksel;
    imgData.data[i+2] = piksel;
    imgData.data[i+3] = alpha;
  }
  saveVersion(imgData);
  ctx.putImageData(imgData,0,0); 
}

//image thresholding
function thresholding(){
  reset();
  let c = document.getElementById('canvas');
  let c2 = document.getElementById('canvas2');
  let ctx = c.getContext('2d');
  let ctx2 = c2.getContext('2d');
  let imgData = ctx.getImageData(0,0, c2.width, c2.height);
  for(let i = 0;i<imgData.data.length;i+=4){
    let threshold = (imgData.data[i] + imgData.data[i+1] + imgData.data[i+2])/3;
    threshold = Math.round(threshold);
    if(threshold > 127)
      threshold = 255;
    else
      threshold = 0;
    let alpha = imgData.data[i+3];
    imgData.data[i] = threshold;
    imgData.data[i+1] = threshold;
    imgData.data[i+2] = threshold;
    imgData.data[i+3] = alpha;
  }
  ctx.putImageData(imgData,0,0);
  saveVersion(imgData);
}

//odstranjevanje posameznih barvnih kanalov
function odstraniBarvneKanale(){
  reset();
  let c = document.getElementById('canvas');
  let c2 = document.getElementById('canvas2');
  let ctx = c.getContext('2d');
  let ctx2 = c2.getContext('2d');
  let imgData_temp = ctx.getImageData(0,0, c2.width, c2.height);
  let imgData = ctx.getImageData(0,0, c2.width, c2.height);
  for(let i = 0;i<imgData.data.length;i+=4){
    //rdeca
    if(document.getElementById('odstrani0').checked){
      imgData.data[i] = 0;
    }
    else{
      imgData.data[i] = imgData_temp.data[i];
    }
    //zelena
    if(document.getElementById('odstrani1').checked){
      imgData.data[i+1] = 0;
    }
    else{
      imgData.data[i+1] = imgData_temp.data[i+1];
    }
    //modra
    if(document.getElementById('odstrani2').checked){
      imgData.data[i+2] = 0;
    }
    else{
      imgData.data[i+2] = imgData_temp.data[i+2];
    }
    let alpha = imgData.data[i+3];
    imgData.data[i+3] = alpha;
  }
  ctx.putImageData(imgData,0,0);
  saveVersion(imgData);
}

//poudarjanje posameznih barvnih kanalov
function poudariBarvneKanale(){
  reset();
  let c = document.getElementById('canvas');
  let c2 = document.getElementById('canvas2');
  let ctx = c.getContext('2d');
  let ctx2 = c2.getContext('2d');
  let imgData_temp = ctx.getImageData(0,0, c2.width, c2.height);
  let imgData = ctx.getImageData(0,0, c2.width, c2.height);
  for(let i = 0;i<imgData.data.length;i+=4){
    //rdeca
    if(document.getElementById('poudari0').checked){
      imgData.data[i] = 255;
    }
    else{
      imgData.data[i] = imgData_temp.data[i];
    }
    //zelena
    if(document.getElementById('poudari1').checked){
      imgData.data[i+1] = 255;
    }
    else{
      imgData.data[i+1] = imgData_temp.data[i+1];
    }
    //modra
    if(document.getElementById('poudari2').checked){
      imgData.data[i+2] = 255;
    }
    else{
      imgData.data[i+2] = imgData_temp.data[i+2];
    }
    let alpha = imgData.data[i+3];
    imgData.data[i+3] = alpha;
  }
  ctx.putImageData(imgData,0,0);
  saveVersion(imgData);
}

//spreminjanje svetlosti slike
function spreminjanjeSvetlostiSlike(){
  reset();
  let c = document.getElementById('canvas');
  let c2 = document.getElementById('canvas2');
  let ctx = c.getContext('2d');
  let ctx2 = c2.getContext('2d');
  let imgData_temp = ctx.getImageData(0,0, c2.width, c2.height);
  let svetlost_value = document.getElementById('svetlost').value;
  document.getElementById('vrednost').innerHTML = svetlost_value;
  let imgData = ctx.getImageData(0,0, c2.width, c2.height);
  for(let i = 0;i<imgData.data.length;i+=4){
    //rdeca
    let piksel = Math.pow(imgData_temp.data[i], svetlost_value);
    if(piksel < 256)
      imgData.data[i] = piksel;
    else
      imgData.data[i] = 255;
    //zelena
    piksel = Math.pow(imgData_temp.data[i+1], svetlost_value);
    if(piksel < 256)
      imgData.data[i+1] = piksel;
    else
      imgData.data[i+1] = 255;
      //modra
    piksel = Math.pow(imgData_temp.data[i+2], svetlost_value);
    if(piksel < 256)
      imgData.data[i+2] = piksel;
    else
      imgData.data[i+2] = 255;
    let alpha = imgData.data[i+3];
    imgData.data[i+3] = alpha;
  }
  ctx.putImageData(imgData,0,0);
  saveVersion(imgData);
}
