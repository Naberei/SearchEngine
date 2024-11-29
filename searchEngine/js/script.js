var state = "Kleve+nrw";
var localTime;
$(document).ready(function(){
    getNews();
    $("#searchBar").focus();
    $("#searchBar").parent().keypress((e) => {       
        if(e.which==13 && val!="" && $("#websiteInput").length==0){
            var value = $("#searchBar").val();
    location.replace("result.html?val="+value+"&page=1");
        }
        else if($("#websiteInput").length!=0)
        {
            var value = $("#searchBar").val();
            var webpage = $("#websiteInput").val();
            if(webpage!=""){
                location.replace("result.html?val="+value+"&page=1&webpage="+webpage);
            }
            
        }
        
    })

    $("#changeState").keypress((e) => {       
        if(e.which==13){
            state = removeSpaces($("#changeState").children("input[type='text']").val());
            getWeather();

        }
    })


    getWeather();
    
})

function searchNormal(e) {
    e.preventDefault();
    var value = $("#searchBar").val();
    if(value!=""){
        location.replace("result.html?val="+value+"&page=1");
    }
    
}

function searchGpt(e){
    e.preventDefault();
    if($("#gptAnswer").length==0){
        $("#contentSearch").append("<div id='gptAnswer'><p class='gptTitle'>Warten auf Antwort...</div>");
    }


        $("#gptAnswer").animate({
            top: "20%"
        }, 2000);
    

        
    
    
    var value = $("#searchBar").val();
    $.ajax({
        url: "https://api.openai.com/v1/engines/text-davinci-003/completions",
        type: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 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"
        },
        data: JSON.stringify({
            "prompt": "Answer the following prompt in the same language (or in german as default) or follow the instruction. Answer in less than 300 tokens. Do not ever answer with wrong informations. If you do not know the answer, then say so: "+value + ".",
            "temperature": 0.5,
            "max_tokens": 300
        }),
        success: function(response) {
            $("#gptAnswer").children("p").remove();

            let answer = response["choices"][0]["text"];
            let answerArray = answer.split("");
            if($("#titleImg").length==0){
                $("#gptAnswer").append("<img id='titleImg' src='img/openAiLogo.png'>");
            }
            $("#gptAnswer").append("<p id='gptAnswerP'></p>");
            for(var i =0; i<answerArray.length;i++){
                setTimeout(addChar(i, answerArray), 300);
            }
            console.log(response);
        },
        error: function(error){
            console.log(error);
        }
    });
    
}

function addChar(i, array){
    let currentStr = $("#gptAnswerP").text();
    $("#gptAnswerP").text(currentStr+array[i]);
}

function changeState(e){
    state = removeSpaces($("#changeState").children("input[type='text']").val());
getWeather()
    e.preventDefault();

}

function removeSpaces(str){
    return str.replace("+", " ");
}




function getWeather(){
    $.ajax({
        url: "https://api.weatherapi.com/v1/current.json?key=6ddb0c4dfc204280b26180542231401 &q="+state,
        type: "GET",
        success: function(response) {
            let location = response["location"]["name"]+" "+response["location"]["region"];
            let time = response["location"]["localtime"];
            localTime = new Date(time);
            let current = response["current"];
            let feelLikeTemp = current["feelslike_c"]+"°C";
            let currentTemp = current["temp_c"]+"°C";
            let windGeschwindigkeit = current["wind_kph"]+"KMPH";
            let windRichtung = current["wind_degree"]+"°";
            let feuchtigkeit = current["humidity"]+"%";
            let niederschlag = current["precip_mm"] + "mm";
            let bild = "https:"+current["condition"]["icon"];
            let text = current["condition"]["text"];
            let lastUpdate = current["last_updated"];
            $("#weatherDiv").children().remove();
            var lat;
            var long;
            var sunSetted;
            $.ajax({
                url: "https://api.opencagedata.com/geocode/v1/json",
                data: {
                    key: "feb98130f15242cc81e03d86738da70e",
                    q: state
                },
                success: function(response) {
                   lat= response["results"]["0"]["geometry"]["lat"];
                   lng=response["results"]["0"]["geometry"]["lng"];
                   $.ajax({
                    url: "https://api.sunrise-sunset.org/json",
                    data: {
                        lat: lat,
                        lng: long,
                        date: "today",
                        formatted: 0
                    },
                    success: function(response) {
                        
                        var sunset = new Date(response.results.sunset);
                        var sunrise = new Date(response.results.sunrise);
                        var now = localTime;
                        console.log(response);
                        console.log(sunset);
                        console.log(sunrise);
                        console.log(now);
                        if (now.getTime()<sunrise.getTime() || now.getTime() > sunset.getTime()) {
                            sunSetted = true;
                        } else {
                            sunSetted = false;
                        }
                        console.log(sunSetted);
                        if(sunSetted) {
                            $("#weatherDiv").css("background-color","#180133");
                            $("#weatherDiv").css("box-shadow","0 0 10px #180133");
                            $("#weatherDiv").css("background-image","url('img/nightSky.png')");
                            $("#weatherDiv").css("background-repeat","no-repeat");
                            $("#weatherDiv").css("background-size","0%");
                            $("#weatherDiv").animate({
                                "background-size": "100%"
                            }, 2000);
                        }
                        else{
                            $("#weatherDiv").css("background-color","rgb(66, 151, 248)");
                            $("#weatherDiv").css("box-shadow","0 0 10px #180133");
                            $("#weatherDiv").css("background-image","none");
                        }
            
                        $("#weatherDiv").append("<form submit='changeState(event)' id='changeState'><input type='submit' id='stateSubmit' onclick='changeState(event)'  hidden><input type='text' class='form-control' placeholder='Stadt'></form><div id='location'><p id='locationP'>"+location+"</p><p id='lastUpdate'>"+lastUpdate+"</p></div><div id='condition'><div id='tempDiv'><img id='weatherImg'src='"+bild+"'><p id='currentTemp'>"+currentTemp+"</p><p id='feelTemp'>| "+feelLikeTemp+"</p></div><div id='localTimeDiv'><p>"+text+", </p><p id='localTime'>"+time+"</p></div></div><div id='otherWeather'><p id='feuchtigkeit'>Feuchtigkeit: "+feuchtigkeit+"</p><p id='wind'>Wind: "+windGeschwindigkeit+"</p><p id='niederschlag'>Niederschlag: "+niederschlag+"</p></div>");
                        console.log(response);
                    }
                });
                    
                }
            });


            
        }
    });
}

function getNews(){
    $.ajax({
        url: "https://newscatcherapi.com/v2/search_free",
        type: "GET",
        data: {
            q: "elonmusk",
            language: "de"
        },
        success: function(response){
            console.log(response);
        }
        
    });
}

function openWebsiteInput(e) {
    e.preventDefault();
    $("#websiteSearch").remove();
    $("#submitNormal").val("in Webseite suchen");
    $("#submitNormal").css("font-size","10px");
    $("#submitAi").before("<input class='submitButton' type='text' id='websiteInput' placeholder='Webseite'>");
}

function stopSubmit(event) {
    event.preventDefault();
    return false;
}