var pageNum;
var value;
var webpage;
$(document).ready(function(){

    pageNum = getUrlParameter("page");
    value = removeSpaces(getUrlParameter("val"));
    webpage = getUrlParameter("webpage");

    gptAnswer(getUrlParameter("val"));
    document.title=value+" - Brainiac Search";
    $("#searchBar").val(addSpaces(value));
    if(pageNum==1){
        $("#pageBackBtn").attr("hidden",true);
        $("#pageBackBtn").attr("disabled",true);
    }
    else{
        $("#pageBackBtn").attr("hidden",false);
        $("#pageBackBtn").attr("disabled",false);
    }
    if(pageNum>10){
    for(var i = pageNum-9; i<=pageNum; i++){
        if(i==pageNum){
            $("#pageForwardBtn").before("<a class='currentPageLink' href='result.html?val="+value+"&page="+i+"'>"+i+"</a>");
        }
        else{
            $("#pageForwardBtn").before("<a class='pageLink' href='result.html?val="+value+"&page="+i+"'>"+i+"</a>");
        }

    }
}
else{
    for(var i = 1; i<=10; i++){
        if(i==pageNum){
            $("#pageForwardBtn").before("<a class='currentPageLink' href='result.html?val="+value+"&page="+i+"'>"+i+"</a>");
        }
        else{
            $("#pageForwardBtn").before("<a class='pageLink' href='result.html?val="+value+"&page="+i+"'>"+i+"</a>");
        }

    }
}

      if(!webpage){
        $.ajax({
            url: "https://www.googleapis.com/customsearch/v1",
            data: {
              key: "AIzaSyB_V6bSVQyrmPhwi9f1wxc1s9Zp-AEa99g",
              cx: "33233c0c8d5544060",
              q: value,
              hl: "de",
              format: "json",
              start: pageNum
    
            },
            success: function(response){
                let totalResults = response["searchInformation"]["formattedTotalResults"];
                let loadTime = response["searchInformation"]["formattedSearchTime"];
                  console.log(response);
                  if(response["searchInformation"]["totalResults"]!=0){
                       $("#pageButtons").before("<p id='numberResults'>Ungefähr "+totalResults+" Ergebnisse ("+loadTime+" Sekunden)</p>");
                       for(var i = 0; i<response["searchInformation"]["totalResults"];i++){
                       let result = response["items"][i];
                       let title = shortenStr("title",result["title"]);
                       let description = shortenStr("description", result["htmlSnippet"]);
                       let url = shortenStr("url",result["link"]);
                       let urlStr = result["link"].toString();
                       $("#pageButtons").before("<div class='resultDiv'><button id='gptInfo' onclick='gptInfo(this)'><img src='img/moreOptions.png'></button><p class='title'><a href="+url+">"+title+"</a></p><a href='"+url+"'class='link'>"+url+"</a><p class='description'>"+description+"</p></div>");
                       }
                   }
                   else {
                   $("#pageButtons").before("<h2 id='noResults'>Sieht so aus als gäbe es keine Ergebnisse!</h2>")
                   }
              },
              error: function(error) {
                $("#pageButtons").before("<h2 id='noResults'>Anfrage fehlgeschlagen! Error: "+error+"</h2>")
              }
        });
      }
      else {
        $.ajax({
            url: "https://www.googleapis.com/customsearch/v1",
            data: {
              key: "AIzaSyB_V6bSVQyrmPhwi9f1wxc1s9Zp-AEa99g",
              cx: "33233c0c8d5544060",
              q: value,
              hl: "de",
              format: "json",
              start: pageNum,
              siteSearch: webpage
    
            },
            success: function(response){
                let totalResults = response["searchInformation"]["formattedTotalResults"];
                let loadTime = response["searchInformation"]["formattedSearchTime"];
                  console.log(response);
                  if(response["searchInformation"]["totalResults"]!=0){
                       $("#pageButtons").before("<p id='numberResults'>Ungefähr "+totalResults+" Ergebnisse ("+loadTime+" Sekunden)</p>");
                       for(var i = 0; i<response["searchInformation"]["totalResults"];i++){
                       let result = response["items"][i];
                       let title = shortenStr("title",result["title"]);
                       let description = shortenStr("description", result["htmlSnippet"]);
                       let url = shortenStr("url",result["link"]);
                       let urlStr = result["link"].toString();
                       $("#pageButtons").before("<div class='resultDiv'><button id='gptInfo' onclick='gptInfo(this)'><img src='img/moreOptions.png'></button><p class='title'><a href="+url+">"+title+"</a></p><a href='"+url+"'class='link'>"+url+"</a><p class='description'>"+description+"</p></div>");
                       }
                   }
                   else {
                   $("#pageButtons").before("<h2 id='noResults'>Sieht so aus als gäbe es keine Ergebnisse!</h2>")
                   }
              },
              error: function(error) {
                $("#pageButtons").before("<h2 id='noResults'>Anfrage fehlgeschlagen! Error: "+error+"</h2>")
              }
        });
      }


    $("#searchBar").parent().keypress((e) => {       
        if(e.which==13){
            e.preventDefault();
            
            var value = $("#searchBar").val();
    location.replace("result.html?val="+value+"&page=1");
    return false;
        }
    })
})

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

function removeSpaces(str){
    return str.replace("+", " ");
}

function addSpaces(str){
    return str.replace("+",/ /g);
}

function shortenStr(type, str){
    var maxChar;
    if(type=="url" || type=="title") {
        maxChar = 65;
    }
    else if(type=="description"){
        maxChar = 200;
    }
    if(str.length>maxChar){
        return str.substring(0, maxChar) + "...";
    }
    else{
        return str;
    }
}

function pageForward(){
    pageNum++;
    location.replace("result.html?val="+value+"&page="+pageNum);
}

function pageBack() {
    pageNum--;
    location.replace("result.html?val="+value+"&page="+pageNum);
}

function suchFilter() {
    
}



function gptInfo(e) {
    if($("#gptInfoDiv").length==0){
        $(e).parent().parent().append("<div id='gptInfoDiv'><button onclick='gptInfoClose(this)' id='gptInfoClose'><img src='img/cross.png'></button><p id='answer'>Warten auf Antwort...</p></div>");
        $("#gptInfoDiv").animate({
            top: "10%"
        },2000)
        var url = $(e).parent().children("a").attr("href");
        console.log("Give me information about the trustworthyness of the url '"+url+"' and additional infos. Do not ever answer with wrong informations.");
        $.ajax({
            url: "https://api.openai.com/v1/engines/text-davinci-003/completions",
            type: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer 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"
            },
            data: JSON.stringify({
                "prompt": "Give me information about the trustworthyness of the url '"+url+"',also considering the name of the website. For example a website, that sells things doesn't has to be known to be trustworthy, but a website that gives important infos has to be more known. Also give additional infos. Do not ever answer with wrong informations. Always answer in under 100 tokens.",
                "temperature": 0.5,
                "max_tokens": 200
            }),
            success: function(response) {
                
    
                let answer = response["choices"][0]["text"];
               
                
                $("#answer").text(answer);
                
                console.log(response);
            },
            error: function(error){
                console.log(error);
            }
        });
    }

    
}
function gptAnswer(value){
if($("#gptAnswer").length==0){
    $("#contentSearch").append("<div id='gptAnswer'><p class='gptTitle'>Warten auf Antwort...</div>");
}


    $("#gptAnswer").animate({
        top: "20%"
    }, 2000);


    
$.ajax({
    url: "https://api.openai.com/v1/engines/text-davinci-003/completions",
    type: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
    },
    data: JSON.stringify({
        "prompt": "Answer the following search prompt in the same language, follow the instruction or give information about the given keywords. Answer in less than 300 tokens. Do not ever answer with wrong informations. If you do not know the answer, then say so: "+value +".",
        "temperature": 0.5,
        "max_tokens": 300
    }),
    success: function(response) {
        $("#gptAnswer").children("p").remove();

        let answer = response["choices"][0]["text"];
    
        if($("#titleImg").length==0){
            $("#gptAnswer").append("<img id='titleImg' src='img/openAiLogo.png'>");
        }
        $("#gptAnswer").append("<p id='gptAnswerP'>"+answer+"</p>");
        
        console.log(response);
    },
    error: function(error){
        console.log(error);
    }
});
}

function gptInfoClose(e) {
    $(e).parent().animate({
        top: "-50%"
    }, 2000);
    setTimeout(function(){
        $(e).parent().remove();
    },2000)
}

//first api key AIzaSyBAPEn_AGU1o7et1l7uemJwMwBXwh_-vvg
//second api key (google custom search) AIzaSyB_V6bSVQyrmPhwi9f1wxc1s9Zp-AEa99g