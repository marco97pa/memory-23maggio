/*  -----------------------------------------------
 *      Game Logic - written by Marco Fantauzzo
 *  -----------------------------------------------
 *  It is the memory game: when 2 cards match, they will be deleted
 *  Specifications: 20 cards (10 couples)
 *  
 *  Using: JQuery, Javascript ES6 (for array copy and concatenation)
 * 
 */


/* DECLARATION */  

//Possibile cards of the game: they are more than the actual cards, they will be chosen randomly by generateCards()
cards = [
    'borsellino',
    'catalano',
    'cosina',
    'dicillo',  
    'falcone',
    'li_muli',
    'loi',  
    'montinaro',
    'morvillo',
    'schifani',
    'traina'
];

//Backgrounds of the grid-container. One of these will be chosen randomly by generateBackground()
backgrounds = [
    'andra_tutto_bene.jpg',
    'falcone_borsellino.jpg',
    'locandina.jpg'
];

//Sound effects
const picked = new Audio("sounds/picked.mp3");
const yes = new Audio("sounds/correct.mp3");
const win = new Audio("sounds/win.mp3");

//Main code, launched at document.ready
$(document).ready(function(){

    debugMessage();

    //Load the game
    generateBackground();
    generateCards();
    init();


    // On click function on each card (grid-item)
    $(".grid-container").on("click", ".grid-item", function() {
        //Prevent multi click, continuing after game ends, clicking on removed cards or cards already selected
        if(selected < 2 && remaining > 0 && !$( this ).hasClass("removed") && !$( this ).hasClass("selected")){ 
            //We picked a card, play sound and show it
            picked.play();
            $( this ).addClass("selected");
            selected++;

            //If more than 1 card is selected start the comparision between the 2 cards
            if(selected > 1){
                //set a timeout of 2 seconds to show the cards to the user
                setTimeout(function() {
                    //if cards have the same data (so the same image)
                    if($(".selected:eq(0)").data("card") == $(".selected:eq(1)").data("card") ){
                        //They match: play a sound and remove the card
                        yes.play();
                        $( ".selected:eq(0)" ).addClass("removed");
                        $( ".selected:eq(1)" ).addClass("removed");
                        remaining = remaining - 2;

                        //Check if there are no more cards
                        if(remaining == 0){
                            //If true, the player has win: play sound and show the overlay
                            win.play();
                            $( "#overlay" ).slideToggle(); //animation
                            $('#start_play').removeClass("only_mobile");
                            game_ended = true;
                        }
                    }

                    //Deselect all cards after the comparision
                    $( ".selected" ).each(function() {
                        $( this ).removeClass("selected");
                    });
                    selected = 0;

                }, 2000);
            }
        }
    });

    //Overlay click: close the overlay
    $('#overlay').click(function (){
        $( "#overlay" ).slideToggle(); //always with cool animations
    });


    //Start button on click
    $('#start_play').click(function (){

        //If game is already ended, start a new game
        if(game_ended){
            startNewGame();
        }

        //Scroll to the game UI (useful on mobile)
        $('html, body').animate({
            scrollTop: $(".grid-container").offset().top
        }, 1000)
    });

});

//START NEW GAME
function startNewGame(){
    clean();
    generateBackground();
    generateCards();
    init();
    $('#start_play').addClass("only_mobile"); //Hide the button on desktop
}

//INIT: initialize game variables
function init() {
    selected = 0;
    remaining = 20;
    game_ended = false;
}

//GENERATE BACKGROUND: randomly chooses a background between backgrounds array and sets it as grid-container background
function generateBackground(){
    var random = Math.floor(Math.random() * backgrounds.length);
    $( ".grid-container" ).css("background-image", "url('images/backgrounds/" + backgrounds[random] + "')");
}

//GENERATE CARDS: randomly chooses cards between cards array and adds them as children to grid-container
function generateCards(){

    var elem_s = "<div class='grid-item' data-card='"; //HTML element start
    var elem_e = "'></div>"; //HTML element end
    var random = Math.floor(Math.random() * cards.length);
    var i, x;

    //Copies the cards array into game_cards, removes one element and duplicates the elements (so they will be 20)
    game_cards = [...cards];
    game_cards.splice(random, 1);
    game_cards = [...game_cards, ...game_cards];

    //Adds 20 random cards to the grid-container, removing each one from the game_cards array to not repeat them more than 2 times
    for(i = 0; i < 20; i++){
        x = Math.floor(Math.random() * game_cards.length);
        $( ".grid-container" ).append(elem_s + game_cards[x] + elem_e);
        game_cards.splice(x, 1);
    }

}

//CLEAN: removes all children from grid-container
function clean(){
    $( ".grid-container" ).empty();
}

//DEBUG MESSAGE: Shows a console.log message to make debugging easier
function debugMessage(){
    console.log("DEBUG: informations for developers\nTo make the debugging process of the WebApp easier without playing the game, I suggest you two functions for testing purposes:\n- clean(): deletes all the cards (cleans the .grid-container) so you can see the background easily\n- remaining = 2: just match a couple of cards to win the game\nFunctions should be written here, in the console");
}

