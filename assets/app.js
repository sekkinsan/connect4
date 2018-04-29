
$(document).ready(function() {
    // TODO: make grid
    const connect4 = new Connect4('#board')

    $('#restart').click(function() {
        connect4.restart();
    })
});




