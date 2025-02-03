const darkModeToggle = document.getElementById('darkModeToggle');
const header = document.getElementsByClassName('navbar')[0];
const body = document.querySelector(".dark");
const cards = document.querySelectorAll(".card");
const solid = document.querySelector(".solids");
console.log(header,body,cards);
const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
if (isDarkMode==true){
    solid.classList.add('dark-solid');
    header.classList.add('dark-mode');
    body.classList.add('dark-mode');
    addBack();
    darkModeToggle.checked = true;
}
darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked){
        solid.classList.add('dark-solid');
        header.classList.add('dark-mode');
        body.classList.add('dark-mode');
        addBack();
        localStorage.setItem('darkMode', 'enabled');
    }
    else{
        setTimeout(()=>{
            solid.classList.remove('dark-solid');
            header.classList.remove('dark-mode');
        body.classList.remove('dark-mode');
        removeBack();
        localStorage.setItem('darkMode', 'disabled')
        },500);
        
    }
});

function addBack(){
    for(card of cards){
        card.classList.add("card-dark");
    }
}
function removeBack(){
    for(card of cards){
        card.classList.remove("card-dark");
    }
}