function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function setTimer() {
    var gStartTime = Date.now();
    var elTimer = document.querySelector('.timer');
    gTimerInterval = setInterval(function () {
        var seconds = (Date.now() - gStartTime) / 1000;
        elTimer.innerText = seconds.toFixed(3);
    }, 100);
}

function shuffle(nums) {
    var randIdx, keep, i;
    for (i = nums.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, nums.length - 1);
        keep = nums[i];
        nums[i] = nums[randIdx];
        nums[randIdx] = keep;
    }
    return nums;
}