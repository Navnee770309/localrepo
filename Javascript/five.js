// let head = document.getElementById("heading");
// head.innerText=head.innerText+" from Apna College Students";

// let newBtn=document.createElement("button");
// newBtn.innerText="CLICK ME";
// console.log(newBtn);
// let div = document.querySelector("div")
// div.append(newBtn);
// let btn = document.querySelector("#btn");
// btn.onclick=()=>{
//     console.log("You have clicked the button")
// }
// let div = document.querySelector("#box");
// div.onmouseover=()=>{
//     console.log("You are inside div")
// }

//Toggling the button
let modeBtn = document.querySelector("#btn");
let currMode ="light";
let body = document.querySelector("body");
modeBtn.addEventListener("click",()=>{
    if(currMode==="light"){
        currMode="dark";
        body.classList.add("dark");
        body.classList.remove("light");
    }
    else{
        currMode="light";
        body.classList.add("light");
        body.classList.remove("dark");
    }
    console.log(currMode);
})