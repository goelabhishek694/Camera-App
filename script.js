let videoElem=document.querySelector("video");
let recordVideo=document.querySelector("#record_video");
let clickPic=document.querySelector("#click_pic");
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
                const url=window.URL.createObjectURL(blob);
                let a=document.createElement("a");
                a.download="file.mp4";
                a.href=url;
                a.click();
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
                mediaRecorder.start();
                recordVideo.innerHTML="Recording";
                recordState=true;
            }
            else if(recordState){
                mediaRecorder.stop();
                recordVideo.innerHTML="Record";
                recordState=false;
            }
        })

