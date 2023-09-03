const $ = document;

const container = $.querySelector(".container");
const mainVideo = $.querySelector("video");
const playPauseBtn = $.querySelector(".play-pause i");
const progressBar = $.querySelector(".progress-bar");
const skipBackward = $.querySelector(".skip-backward i");
const skipForward = $.querySelector(".skip-forward i");
const VolumBtn = $.querySelector(".volume i");
const VolumSlider = $.querySelector(".left input");
const speedBtn = $.querySelector(".playback-speed i");
const speedOptions = $.querySelector(".speed-options");
const speedOption = speedOptions.querySelectorAll("li");
const picInPicBtn = $.querySelector(".pic-in-pic i");
const fullscreenBtn = $.querySelector(".fullscreen i");
const VideoTimeline = $.querySelector(".video-timeline");
const currentVideoTime = $.querySelector(".current-time");
const videoDuration = $.querySelector(".video-duration");
const videoImage = $.querySelector("#video-image");
let timer;

const hideControls = () => {
    if(mainVideo.paused) return;
    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    }, 3000);
}
hideControls();

container.addEventListener("mousemove" , () => {
    container.classList.add("show-controls");
    clearTimeout(timer);
    hideControls();
});

playPauseBtn.addEventListener("click" , () => {
    mainVideo.paused ? mainVideo.play() : mainVideo.pause();
    videoImage.style.display = "none";
    mainVideo.style.display = "flex";
});

mainVideo.addEventListener("play" , () => {
    playPauseBtn.classList.replace("ri-play-fill" , "ri-pause-fill");
});

mainVideo.addEventListener("pause" , () => {
    playPauseBtn.classList.replace("ri-pause-fill" , "ri-play-fill");
});

const formatTime = time => {
    let secounds = Math.floor(time % 60);
    let minutes = Math.floor(time / 60) % 60;
    let hours = Math.floor(time / 3600);

    secounds = secounds < 10 ? `0${secounds}` : secounds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if(hours == 0) {
        return `${minutes}:${secounds}`;
    }
    return `${hours}:${minutes}:${secounds}`;
}

mainVideo.addEventListener("timeupdate" , e => {
    let {currentTime, duration } = e.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVideoTime.innerText = formatTime(currentTime);
});

skipBackward.addEventListener("click" , () => {
    mainVideo.currentTime -= 5;
});
skipForward.addEventListener("click" , () => {
    mainVideo.currentTime += 5;
});

VolumBtn.addEventListener("click" , () => {
    if(!VolumBtn.classList.contains("ri-volume-up-fill")) {
        mainVideo.volume = 0.5;
        VolumBtn.classList.replace("ri-volume-mute-fill", "ri-volume-up-fill");
    } else {
        mainVideo.volume = 0.0;
        VolumBtn.classList.replace("ri-volume-up-fill", "ri-volume-mute-fill");
    }
    VolumSlider.value = mainVideo.volume;
});

VolumSlider.addEventListener("input" , e => {
    mainVideo.volume = e.target.value;
    if(e.target.value == 0) {
        VolumBtn.classList.replace("ri-volume-up-fill", "ri-volume-mute-fill");
    } else {
        VolumBtn.classList.replace("ri-volume-mute-fill", "ri-volume-up-fill")
    }
   
});

speedBtn.addEventListener("click" , () => {
    speedOptions.classList.toggle("show");
});

$.addEventListener("click" , e => {
    if(!e.target.classList.contains("ri-speed-up-fill")) {
        speedOptions.classList.remove("show");
    }
});

speedOption.forEach(option => {
    option.addEventListener("click" , () => {
        mainVideo.playbackRate = option.dataset.speed;
        speedOptions.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

picInPicBtn.addEventListener("click" , () => {
    mainVideo.requestPictureInPicture();
});

fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            console.error('Error attempting to enable full-screen mode:', err);
        });
        fullscreenBtn.classList.replace("ri-fullscreen-fill", "ri-fullscreen-exit-fill");
    } else {
        document.exitFullscreen();
        fullscreenBtn.classList.replace("ri-fullscreen-exit-fill", "ri-fullscreen-fill");
    }
})

VideoTimeline.addEventListener("click" , e => {
    let timelineWidth = VideoTimeline.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

mainVideo.addEventListener("loadeddata" , e => {
    videoDuration.innerText = formatTime(e.target.duration);
});

const draggableProgressBar = e => {
    let timelineWidth = VideoTimeline.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVideoTime.innerText = formatTime(mainVideo.currentTime);
};
VideoTimeline.addEventListener("mousedown" , () => {
    VideoTimeline.addEventListener("mousemove" , draggableProgressBar);
});

container.addEventListener("mouseup" , () => {
    VideoTimeline.removeEventListener("mousemove" , draggableProgressBar);
});

VideoTimeline.addEventListener("mousemove" , e => {
    const progressTime = VideoTimeline.querySelector("span");
    let offsetX = e.offsetX;
    progressTime.style.left = `${offsetX}px`;
    let timelineWidth = VideoTimeline.clientWidth;
    let percent = (e.offsetX / timelineWidth) * mainVideo.duration;
    progressTime.innerText = formatTime(percent);
});

const seekVideo = (offset) => {
    mainVideo.currentTime += offset;
}

$.addEventListener("keydown" , e => {
    switch (e.key) {
        case "ArrowLeft":
            seekVideo(-5);
            break;

        case "ArrowRight":
            seekVideo(5)
            break;

        case "ArrowUp":
            changeVolume(0.1);
            break;

        case "ArrowDown":
            changeVolume(-0.1);
            break;

        case " ":
            toggleVideoPlayBack();
            videoImage.style.display = "none";
            mainVideo.style.display = "flex";
            break;

        default:
            break;
    };
});

let initialVolume = 0.5;

const changeVolume = (offset , initialVolume = 0.5) => {
    const currentVolume = mainVideo.volume;
    let newVolume = currentVolume + offset;

    newVolume = Math.max(0, Math.min(1, newVolume));

    mainVideo.volume = newVolume;
    VolumSlider.value = mainVideo.volume;
    console.log(mainVideo.volume);
}

mainVideo.volume = initialVolume;

const toggleVideoPlayBack = () => {
    if (mainVideo.paused) {
        mainVideo.play();
    } else {
        mainVideo.pause();
    }
}


