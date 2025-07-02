let str ="Javascript";
let size=0;
for(let i of str){
    console.log("i= "+i);
    size++;
}
console.log(size);

// let gameNum = 25;
// let userNum = prompt("Enter the number:");
// while(gameNum!=userNum){
//     userNum=prompt("The lase entered number is wrong, enter the number again: ");
// }
// console.log("Congratulations!! you entered the correct number")

let username = prompt("Enter the name: ");
let size1=0;
for(let i of username){
    console.log(i);
    size1++;
}
console.log(`@${username}${size1}`);
