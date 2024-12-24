const gameContainer = document.querySelector('.container');
const userResult = document.querySelector('.user_result img');
const cpuResult = document.querySelector('.cpu_result img');
const result = document.querySelector('.result');
const optionImages = document.querySelectorAll('.option_image');
optionImages.forEach((image,index)=>{
    image.addEventListener('click',(e)=>{
        image.classList.add("active");
        userResult.src = cpuResult.src = "images/images/rock.png";
        result.innerHTML = "Wait..."
        optionImages.forEach((image2,index2)=>{
            index !== index2 && image2.classList.remove("active");
        });
        gameContainer.classList.add("start");
        let time = setTimeout(()=>{
            gameContainer.classList.remove("start");
            let imgSrc = e.target.querySelector("img").src;
            userResult.src = imgSrc;
            let randomNumber = Math.floor(Math.random()*3);
            let cpuImages = ["images/images/rock.png","images/images/paper.png","images/images/scissors.png"];
            cpuResult.src = cpuImages[randomNumber];

            let cpuValue = ['R','P','S'][randomNumber];
            let userValue = ['R','P','S'][index];

            let outcomes = {
                RR: "Draw", PP: "Draw", SS: "Draw",
                RP: "CPU", RS: "User",
                PR: "User", SR: "CPU",
                PS: "CPU", SP: "User"
            }

            let outcomeValue = outcomes[userValue+cpuValue];
            result.innerHTML = userValue===cpuValue ? "Match Draw" : `${outcomeValue} Won !!`;
        },2500);
    });

    
})