var xhttp = new XMLHttpRequest();
var inputSet = [];
var updatedSet =[];
var countCorrect = 0;
var countIncorrect = 0;
var markCorrect = 4;
var markIncorrect = 1;
var allotedTime = "00:05:30";
xhttp.onreadystatechange=function(){
    if(this.readyState==4 && this.status==200){
        response = JSON.parse(this.responseText);
        inputSet = response;
        //document.getElementById("demo").innerHTML=qaSet;
        console.log(inputSet);
        modify();

    }
}

xhttp.open("GET","./file/test1.json",true);
xhttp.send();

var qnum = 1;
const question = document.getElementById("question");
const options = document.getElementsByClassName("optionText");
var saveAndNextButton = document.getElementById("saveAndNext");
var saveButton = document.getElementById("save");
var selectedOption = document.getElementsByName("selectedOption");
var paletteButtons;

function modify(){
    updatedSet = inputSet.map( (set,index) =>{
        //  console.log(index);
        const qaObject = {
            questionNumber : index+1,
            question : `<pre>${set.question}</pre>`,
            options : [],
            selected : -1
        }
        qaObject.answer = set.answer;
        for(var property in set){
            // console.log(property);
            if(set.hasOwnProperty(property) && property.toString().startsWith("option")){
                // console.log(property);
                qaObject.options.push(`<pre>${set[property]}</pre>`);
            }
        }
        
        return qaObject;
    });
    console.log(updatedSet);
    document.getElementById("marksInfo").innerHTML = `correct Answer : ${markCorrect} &nbsp &nbsp Incorrect   Answer : ${-markIncorrect}`;
    inititalizePalette();
    startTest();
    timerStart();
}
function timerStart(){
    var durationArray = allotedTime.split(":");
    var duration = parseInt(durationArray[0]*3600, 10) + parseInt(durationArray[1]*60,10) + parseInt(durationArray[2],10);
    // alert(duration);
    start = Date.now();
    var myTimer = setInterval(timer,1000);
    function timer(){
        current = Date.now();
        diff = Math.floor((current - start)/1000) ;
        if(diff > duration){
            clearInterval(myTimer);
            endTest();
        }
        numHour = Math.floor(diff/3600);
        if(numHour < 10)numHour = ("0" + numHour);
        diff = diff%3600;
        numMin = Math.floor(diff/60);
        if(numMin < 10)numMin = ("0" + numMin);

        numSec = Math.floor(diff%60);
        if(numSec < 10)numSec = "0" + numSec;

        document.getElementById("testTimer").innerHTML = "Time : "+numHour + ":" + numMin + ":" + numSec;

    }

}
function startTest(){
    //  console.log(updatedSet);
     var qObj = updatedSet[qnum-1];
     var questionText = "Question " + qObj.questionNumber + " : " + qObj.question;
     var selectedIndex = qObj.selected;
     question.innerHTML = questionText;
     var optionContainer="";
     var checked = "";
     for(var index = 0; index < qObj.options.length;index++){
         checked = "";
         if(index == selectedIndex)checked = "checked"
         optionContainer += `
            <label class="option">
                <input type = "radio" name = "selectedOption" ${checked}/>
                <!-- <span class="optionPrefix">A</span> -->
                <span class="optionText">${qObj.options[index]}</span>                
            </label>`
            
     };
     document.getElementById("optionContainer").innerHTML = optionContainer;
    paletteButtons[qnum-1].classList.add("visited");
}

function inititalizePalette(){
    // console.log("initiallizing palette");
    var palette = "";
    for(var i = 0 ; i<updatedSet.length ;i++){
        palette +=`<button class = "paletteBtn" id = "paletteBtn${i+1}" data-number = ${i+1}>${i+1}</button>`
    }
    document.getElementById("questionPalette").innerHTML = palette;
    paletteButtons = document.getElementById("questionPalette").childNodes;
    // console.log(paletteButtons);
    for(var i = 0; i<paletteButtons.length; i++){
        paletteButtons[i].addEventListener("click", function(){
           var btnnum = this.dataset.number;
            goToQuestion(btnnum);
        });
    }
}
saveButton.addEventListener("click",save);

function save(){
    selectedIndex = -1;
    var selectedOption = document.getElementsByName("selectedOption");
    for(let index = 0; index < selectedOption.length; index++){
        if(selectedOption[index].checked==true)selectedIndex = index;
    }
    updatedSet[qnum-1].selected = selectedIndex;
    if(selectedIndex != -1)paletteButtons[qnum-1].classList.add("answered");
}
saveAndNextButton.addEventListener("click",() =>{
    save();
    if(qnum < updatedSet.length){
        qnum++;
        startTest();
    }
});

function goToQuestion(q){
    qnum = Number(q);
    startTest();
}

var clearResponse = document.getElementById("clearResponse");
clearResponse.addEventListener("click",function(){
    paletteButtons[qnum-1].classList.remove("answered","markForReview");
    // paletteButtons[qnum-1].classList.add("clearResponse");
    updatedSet[qnum-1].selected = -1;    
    selectedOption.forEach( elem => elem.checked = false );

});

var markforReview = document.getElementById("markForReview");
markforReview.addEventListener("click",function(){
    // alert(qnum);
    paletteButtons[qnum-1].classList.toggle("markForReview");
});

var endTestButton = document.getElementById("endTest").addEventListener("click",()=>{
    if(confirm("Are you Sure want to END the Test")){
        endTest();
    }
});
function endTest(){
    countCorrect = 0;
    countIncorrect = 0;
    for(var i = 0;i<updatedSet.length; i++){
        var qaObject = updatedSet[i];
        if(qaObject.selected != -1 ){
            if(qaObject.options[qaObject.selected] == qaObject.answer)countCorrect++;
            else countIncorrect++;
        }
    }
    marks = countCorrect * markCorrect - countIncorrect * markIncorrect;
    alert(` correct Answers : ${countCorrect}\n incorrect Answers : ${countIncorrect}\n Total Marks :${marks}`);
    console.log(countCorrect + " " + countIncorrect);
    document.cookie = "stetuser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

