let videoElem=document.querySelector("video");
let recordVideo=document.querySelector("#record_video");
let clickPic=document.querySelector("#click_pic");
let timerEle=document.querySelector("#timing");
let allFilters=document.querySelectorAll(".filter");
let uiFilter=document.querySelector(".ui-filter");
let zoomIn=document.querySelector("#plus-container");
let zoomOut=document.querySelector("#minus-container");
let filterColor;
let clearObj;
let mediaRecorder;
let buffer=[];
let recordState=false;
let constraints={
    audio:true,
    video:true
}

navigator.mediaDevices.getUserMedia(constraints)
    .then(function(mediaStream){
        //feed ui
        videoElem.srcObject=mediaStream;
        // audioElem.srcObject=mediaStream;
        mediaRecorder=new MediaRecorder(mediaStream);
        mediaRecorder.addEventListener("dataavailable",function(e){
            buffer.push(e.data);
        })
        mediaRecorder.addEventListener("stop",function(){
            let blob=new Blob(buffer, {type:"video/mp4"});
            buffer=[];
            const url=window.URL.createObjectURL(blob);
            addMediatoGallery(url,"video");
            // let a=document.createElement("a");
            // a.download="file.mp4";
            // a.href=url;
            // a.click();
        })
    })
    .catch(function(err){
        console.log(err);
    })

       
recordVideo.addEventListener("click",function(){
    if(!mediaRecorder){
        alert("allow permissions");
    }
    else if(!recordState){
        startCounting();
        mediaRecorder.start();
        recordVideo.classList.add("record-animation");
        
        // recordVideo.innerHTML="Recording";
        recordState=true;
    }
    else if(recordState){
        mediaRecorder.stop();
        recordVideo.classList.remove("record-animation");
        stopCounting();
        // recordVideo.innerHTML="Record";
        recordState=false;
    }
});

clickPic.addEventListener("click",function(){
    let canvas=document.createElement('canvas');
    canvas.height=videoElem.videoHeight;
    canvas.width=videoElem.videoWidth;
    let tool=canvas.getContext("2d");
    clickPic.classList.add("capture-animation");
    setTimeout(function(){
        clickPic.classList.remove("capture-animation");
    },1000);
    // so that image is zoomed form centre
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(zoomLevel, zoomLevel);
    // this si to invert the image
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    tool.drawImage(videoElem,0,0);
    tool.fillStyle = filterColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);
    let link=canvas.toDataURL();
    // let a=document.createElement("a");
    // a.href=link;
    // a.download="file.png";
    // a.click();
    // a.remove();
    addMediatoGallery(link,"image");
    canvas.remove();
})

function startCounting(){
    timerEle.classList.add("timing-active");
    let timer=1;
    clearObj=setInterval(function(){
        let seconds=(timer%60)<10?`0${timer%60}`:timer%60;
        let minutes=(timer/60)<10?`0${Number.parseInt(timer/60)}`:Number.parseInt(timer/60);
        let hours=(timer/3600)<10?`0${Number.parseInt(timer/3600)}`:Number.parseInt(timer/3600);
        timerEle.innerText=`${hours}:${minutes}:${seconds}`;
        timer++;
    },1000);
}

function stopCounting(){
    timerEle.classList.remove("timing-active");
    timerEle.innerText="00:00:00";
    clearInterval(clearObj);

}

//seting filters
for (let i = 0; i < allFilters.length; i++) {
    allFilters[i].addEventListener("click", function () {
        // add filter to ui
        let color = allFilters[i].style.backgroundColor
        if (color) {
            uiFilter.classList.add("ui-filter-active");
            uiFilter.style.backgroundColor = color;
            filterColor = color;
        } else {
            uiFilter.classList.remove("ui-filter-active");
            uiFilter.style.backgroundColor = "";
            filterColor = "";

        }
    })
}

let zoomLevel=1;
zoomIn.addEventListener("click",function(){
    
    if(zoomLevel<3){
        zoomLevel+=0.2;
        videoElem.style.transform=`scale(${zoomLevel},${zoomLevel})`;
    }
})

zoomOut.addEventListener("click", function () {
    if (zoomLevel > 1) {
        zoomLevel -= 0.2;
        videoElem.style.transform = `scale(${zoomLevel})`;
    }
})

