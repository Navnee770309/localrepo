// let array = ["navneet",90,"rohit","rahul"];
// for(let i of array){
//     console.log(array);
// }

// let arr =[90,89,89,90,34,89];
// let sum =0;
// for(let i in arr){
//     sum=sum+arr[i];
// }
// let average = sum/arr.length;
// console.log(average);

// let arr=[250,645,300,900,50];
// for(let i in arr){
//     arr[i]=arr[i]-(arr[i]*0.1);
// }
// console.log(arr);

// const functionname = (a,b)=>{
//     console.log(a+b);

// }
// functionname(1,3);

let word = prompt("Enter the word");
let vowel =0;
function vowelcount(word){
    for(let i of word){
        if(i=='a'||i=='e'||i=='i'||i=='o'||i=='u'){
            vowel++;;
        }
    }
    console.log(vowel);

}
vowelcount(word);

