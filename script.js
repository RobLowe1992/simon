$(function() {
    //Interval timers
    let interval;
    let timerInterval;
    let gameBoardInterval;
    // jQuery variables
    const $headerText = $('.fly-in-text');
    const $circle = $('.circle');
    const $timer = $('#timer');
    const $easyMode = $('#easy');
    const $hardMode = $('#hard');

    $hardMode.click(function(){
        clearInterval(gameBoardInterval);
        gameObject.hardMode();
    });

    $easyMode.click(function(){
        clearInterval(gameBoardInterval);
    });

    setTimeout(function() {
        $headerText.removeClass('temp-hide');
    }, 500);


    //Game object
    const gameObject = {
        colorIds: ['#blue', '#red', '#green', '#yellow'],
        currentLevel: 1,
        timer: 0,
        colorSequence: [],
        playerSelections: [],
        hardMode: function(){
            gameBoardInterval = setInterval(function () {
                $('.container').toggleClass('rotateBoard');
            },2000);
        },
        // Illuminates the colors in the color sequence array
        illuminate:function(color){
            setTimeout(function(){
                $(color).css('opacity', .5);
                setTimeout(function() {
                    $(color).css('opacity', 1);
                },500);
            },500);
        },
        // Randomly selcts colors from the colorIds array and pushes them to the color sequence array
        levelSequence: function(){
            const iterationCount = this.currentLevel + 2;
            for (let i = 0; i < iterationCount; i++) {
                this.colorSequence.push(this.colorIds[Math.floor(Math.random() * 4)]);
            }
            this.startGame(this.colorSequence);
        },
        // Starts the game and interval by calling the illuminate function and passing in the color sequence array
        startGame: function(sequence) {
            let i = 0;
            const self = this;
            interval = setInterval(function(){
                self.illuminate(sequence[i]);
                i++;
                if (i >= sequence.length){
                    clearInterval(interval);
                    timerInterval = setInterval(function() {
                        gameObject.timer++;
                        $timer.text(`Timer: ${gameObject.timer}`);
                    }, 1000)
                }
            }, 1000);
        },
        // Resets the game stats by clearing the colorSequence and playerSelection array, turns off the circle click event listener, stops the in-game timer, removes the rotate class, and updates the player score
        resetStats: function() {
            let highScore = localStorage.getItem('highScore');
            if(highScore !== null){
                if (this.currentLevel > highScore) {
                localStorage.setItem("highScore", this.currentLevel);
                }
            } else {
                localStorage.setItem("highScore", this.currentLevel);
            }

            $('#highScore').text(`High Score: ${highScore}`);
            clearInterval(timerInterval);
            this.colorSequence = [];
            this.playerSelections = [];
            $('.colors').off('click');
            circleClick();
            $circle.removeClass('rotate');
            $('#score').text(`Current Level: ${this.currentLevel}`);
        },
        // Checks conditions to see if the user has won or lost the game
        checkForWin: function(){
        if (this.playerSelections.length === this.colorSequence.length){
            function arraysEqual(playerSelections, colorSequence) {
                if(gameObject.playerSelections.length !== gameObject.colorSequence.length)
                    return false;
                for(let i = gameObject.playerSelections.length; i--;) {
                    if(gameObject.playerSelections[i] !== gameObject.colorSequence[i]){
                        return false;
                    }
                }
                return true;
            }
            var equal = arraysEqual(this.playerSelections,this.colorSequence);

            if (equal === true){
                console.log('You got it. Way to go!');
                this.currentLevel += 1;
                this.resetStats();
                $timer.text(`Solved in ${this.timer} seconds`);
                $('#play').text('Next Level')
            } else {
                console.log('Better luck next time!');
                this.currentLevel = 1;
                this.resetStats();
                $timer.text(`Epic Fail`);
                $('#play').text('Play Again')
            }
        }
    }
}
    //Function for circle class. Clicking this element starts the game.
    function circleClick() {
        $circle.click(function() {
            gameObject.timer = 0;
            $circle.off('click');
            clearTimeout(interval);
            $(this).addClass('rotate');
            gameObject.levelSequence();
            $('.colors').off('click');

            $('.colors').click(function(){
                gameObject.playerSelections.push(`#${this.id}`);
                console.log(gameObject.playerSelections);
                gameObject.checkForWin();
            });
        });
    }
    circleClick();


});