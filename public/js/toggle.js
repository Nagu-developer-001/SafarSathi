// const darkModeToggle = document.getElementById('darkModeToggle');
// const header = document.getElementsByClassName('navbar')[0];
// const body = document.querySelector(".dark");
// const cards = document.querySelectorAll(".card");
// const solid = document.querySelector(".solids");
// console.log(header,body,cards);

// darkModeToggle.addEventListener("change",()=>{
//     if(body.classList.contains("dark-mode")){
//         removeDark();
//     }else{
//         addDark();
//     }
// });

// function addDark(){
//     solid.classList.add('dark-solid');
//     header.classList.add('dark-mode');
//     body.classList.add('dark-mode');
//     for(card of cards){
//         card.classList.add("card-dark");
//     }
// }


// function removeDark(){
//     solid.classList.remove('dark-solid');
//     header.classList.remove('dark-mode');
//     body.classList.remove('dark-mode');
//     for(card of cards){
//         card.classList.remove("card-dark");
//     }
// }

let toggle = document.querySelector("#darkModeToggle");
let dark_logo = document.querySelector(".dark-logo");
let nav = document.querySelector("nav");
let nav_texts = document.querySelectorAll(".nav-text")
let filter = document.querySelector("#filters");
let tax_toggle = document.querySelector(".tax-toggle .form-switch");
let body = document.body;

toggle.addEventListener("change",()=>{
    if(toggle.checked){
        dark_logo.classList.remove("fa-moon");
        dark_logo.classList.add("fa-mountain-sun");
        nav.classList.add("dark-nav")
        for(nav_text of nav_texts){
            nav_text.style.color="#fff";
            nav_text.style.transition="2s";
        }
        body.style.backgroundColor="#33363d";
        body.style.transition = "2s";
        filter.style.color="white";
    }else{
        dark_logo.classList.remove("fa-mountain-sun");
        dark_logo.classList.add("fa-moon");
        nav.classList.remove("dark-nav");
        for(nav_text of nav_texts){
            nav_text.style.color="black";
            nav_text.style.transition="2s";
        }
        body.style.backgroundColor="white";
        body.style.transition = "2s";
        filter.style.color="black";
    }
})