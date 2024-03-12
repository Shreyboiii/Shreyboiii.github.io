const dynamicText = document.querySelector("p span");
const sentences = ["An Aspiring Developer", "Nice To Meet You"];
let sentenceIndex = 0;
let charIndex = 0; 
let isDeleting = false;
typing();

function toggleMenu(){
    const menu = document.querySelector(".ham-links");
    const icon = document.querySelector(".hamburger-icon");

    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

function typing(){
    let currentSentence = sentences[sentenceIndex];
    let currentChar = currentSentence.substring(0,charIndex);
    dynamicText.innerHTML = currentChar;
    console.log(dynamicText.innerHTML);

    if(!isDeleting && charIndex < currentSentence.length) {
        charIndex++;
        setTimeout(typing,100);
    } else if (isDeleting && charIndex > 0){
        charIndex--;
        setTimeout(typing,50);
    } else {
        isDeleting = !isDeleting;
        sentenceIndex = !isDeleting ? (sentenceIndex + 1) % sentences.length : sentenceIndex;
        setTimeout(typing,200);
    }
}
