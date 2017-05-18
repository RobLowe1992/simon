$blue = $('#blue');
$red = $('#red');
$green = $('#green');
$yellow = $('#yellow');
$circle = $('#circle');
var interval;
let gameObject;
$(function() {
    const $headerText = $('.fly-in-text');
    setTimeout(function() {
        $headerText.removeClass('temp-hide');
    }, 500);

    gameObject = {
        colorIds: ['#blue', '#red', '#green', '#yellow'],
        currentLevel: 1,
        colorSequence: [],
        playerSelections: [],
        illuminate:function(color){
            setTimeout(function(){
                $(color).css('opacity', .5);
                setTimeout(function() {
                    $(color).css('opacity', 1);
                },500);
            },500);
        },
        levelSequence: function(){
            const iterationCount = this.currentLevel + 2;
            for (let i = 0; i < iterationCount; i++) {
                this.colorSequence.push(this.colorIds[Math.floor(Math.random() * 4)]);
            }
            this.startGame(this.colorSequence);
        },
        startGame: function(sequence) {
            let i = 0;
            const self = this;
            interval = setInterval(function(){
                self.illuminate(sequence[i]);
                i++;
                if (i >= sequence.length){
                    clearInterval(interval);
                }
            }, 1000);
        }
    }
    function circleClick() {
        $circle.click(function() {
            $circle.off('click');
            clearTimeout(interval);
            $(this).addClass('rotate');
            gameObject.levelSequence();
            $('.colors').off('click');

            $('.colors').click(function(){
                gameObject.playerSelections.push(`#${this.id}`);
                console.log(gameObject.playerSelections);
                checkForWin();
            // for (let i = 0; i < gameObject.colorSequence.length; i++) {
            //     playerSelections[i] = (`$${this.id}`);
            //     console.log(playerSelections)
            // }
            })
        })
    }
    circleClick();
    function checkForWin(){
        if (gameObject.playerSelections.length === gameObject.colorSequence.length){
            function arraysEqual(playerSelections, colorSequence) {
                if(playerSelections.length !== colorSequence.length)
                    return false;
                for(var i = playerSelections.length; i--;) {
                    if(playerSelections[i] !== colorSequence[i]){
                        return false;
                    }
                }
                return true;
            }
            var equal = arraysEqual(gameObject.playerSelections,gameObject.colorSequence);

            if (equal === true){
                console.log('You got it. Way to go!');
                gameObject.colorSequence = [];
                gameObject.playerSelections = [];
                gameObject.currentLevel += 1;
                $('.colors').off('click');
                circleClick();
                $circle.removeClass('rotate');

            } else {
                gameObject.colorSequence = [];
                gameObject.playerSelections = [];
                gameObject.currentLevel = 1
                $('.colors').off('click')
                console.log('Better luck next time!');
                circleClick();
                $circle.removeClass('rotate');
            }
        }
    }
});