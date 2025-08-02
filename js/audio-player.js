const audio = document.getElementById('myAudio');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const seekBar = document.getElementById('seekBar');
const currentTimeText = document.getElementById('currentTime');
const durationText = document.getElementById('duration');
const volumeBar = document.getElementById('volumeBar');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

document.addEventListener('DOMContentLoaded', () => {
  // 시간 포맷
  function formatTime(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // ▶ / ⏸ 토글
  playBtn.addEventListener('click', async () => {
    try {
      await audioCtx.resume();  // 일단 resume 요청 (이미 running이면 무시됨)
      if (audio.paused) {
        await audio.play();
        playIcon.src = 'icon/pause.svg';
      } else {
        audio.pause();
        playIcon.src = 'icon/play.svg';
      }
    } catch (err) {
      console.error("오디오 재생 오류:", err);
    }
  });

  // 재생 시간 표시 업데이트
  audio.addEventListener('timeupdate', () => {
    seekBar.value = audio.currentTime;
    currentTimeText.textContent = formatTime(audio.currentTime);
  });
  /*
  // 전체 길이 설정
  audio.addEventListener('loadedmetadata', () => {
    seekBar.max = audio.duration;
    durationText.textContent = formatTime(audio.duration);
  });
  */
  // 시크바로 위치 조절
  seekBar.addEventListener('input', () => {
    audio.currentTime = seekBar.value;
  });

  // 볼륨 조절
  volumeBar.addEventListener('input', () => {
    audio.volume = volumeBar.value;
  });

  if (audio.readyState >= 1) {
    // 이미 메타데이터가 로드된 상태
    seekBar.max = audio.duration;
    durationText.textContent = formatTime(audio.duration);
  } else {
    audio.addEventListener('loadedmetadata', () => {
      seekBar.max = audio.duration;
      durationText.textContent = formatTime(audio.duration);
    });
  }
});