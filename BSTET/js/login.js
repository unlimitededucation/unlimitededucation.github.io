async function validate(){
    
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    var success = 0;
    if(username.trim().length == 8 && username.trim().slice(0,4) == "STET"){
        const usernum = Number(username.trim().slice(-4))%26;
        // console.log("usernum "+usernum);
        var pass = password.toLowerCase();
        var total = 0;
        for(var i=0;i<6;i++){
            total += pass.charCodeAt(i);
        }
        if((total - usernum ) == 644){
            success = 1;
            await setCookie("stetuser",username,2);
        }
    }

    if(success == 1){
        document.getElementById("logInStatus").innerHTML = "success"
        location.href = "./test.html"
    }
    else{
        document.getElementById("logInStatus").innerHTML = "wrong userId/Password"
    }

}



