const darkModeToggle = document.getElementById('darkModeToggle');
const header = document.getElementsByClassName('navbar')[0];
const body = document.querySelector(".dark");
const cards = document.querySelectorAll(".card");
const solid = document.querySelector(".solids");
console.log(header,body,cards);

darkModeToggle.addEventListener("change",()=>{
    if(body.classList.contains("dark-mode")){
        removeDark();
    }else{
        addDark();
    }
});

function addDark(){
    solid.classList.add('dark-solid');
    header.classList.add('dark-mode');
    body.classList.add('dark-mode');
    for(card of cards){
        card.classList.add("card-dark");
    }
}


function removeDark(){
    solid.classList.remove('dark-solid');
    header.classList.remove('dark-mode');
    body.classList.remove('dark-mode');
    for(card of cards){
        card.classList.remove("card-dark");
    }
}

