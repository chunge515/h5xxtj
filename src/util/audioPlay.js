/*
* 说明：1.本方法只播放音频；
* 使用方式 import audio from "audio";  var aud = new audio([{remotePath:"",playTimes:1}]);
* config 可以传可以不传，
* config格式{
*   onAllEnded:function(){}  所有音频播放完成
* }
* */
function audio(arr, config) {
  this.cfg = config || {};
  //当前是第几个音频
  this.i = 0;
  //当前的音频dom节点
  this.audio = null;
  //媒体文件
  this.medias = arr;

  this.audio = document.createElement("audio");
  this.audio.setAttribute("src", arr[0].remotePath);
  this.audio.setAttribute("style", "display:none");
  var _this = this;
  this.audio.onended = function () {
    perEnd(this, _this);
  }
}

function perEnd(audioDom, audio) {
  var tmp = audio.medias[audio.i];
  if (tmp.playCount < tmp.playTimes) { //重复播放
    tmp.playCount++;
    audioDom.currentTime = 0;
    audioDom.play();
  } else if (audio.i < audio.medias.length - 1) { //有下一个音频
    audio.i++;
    tmp = audio.medias[audio.i];
    tmp.playCount = 1;
    voice(audio, audio.medias[audio.i]);
  } else {
    if (audio.cfg.onAllEnded) {
      audio.cfg.onAllEnded();
    }
  }
}

//播放
function voice(_this, tmp) {
  _this.audio.setAttribute("src", tmp.remotePath);
  _this.audio.play();
}

// 本方法每次调用都会从第一个音频开始播放
audio.prototype.play = function () {
  this.i = 0;
  var tmp = this.medias[this.i];
  if(!tmp)return ;
  voice(this, tmp);
  tmp.playCount = 1;
};
// 从上次播放位置开始播放
audio.prototype.continue = function () {
  this.audio.play();
};
//暂停音频播放--此方法下次播放时会从当前位置继续播放
audio.prototype.pause = function () {
  // console.log("pause play");
  if (!this.audio.paused) {
    this.audio.pause();
  }
};
//销毁
audio.prototype.destroy = function () {
  this.audio = null;
  this.medias = null;
};


export default audio;
