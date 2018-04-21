console.log('Loaded!');
// change the text of the main-text div
var element = document.getElementById('main-text');

//element.innerHTML= 'New value';

// Move the image

var img = document.getElementById('madi');
var marginLeft = 0;
function moveRight(){
    marginLeft = marginLeft + 1;
    img.style.marginLeft = marginLeft + 'px';
}
img.onclick = function() {
   var interval = setInterval(moveRight, 50);
};


// Counter code
var button = document.getElementById('counter');
//var counter=0;
button.onclick = function()
{
    
    // create a request object
    var request= new XMLHttpRequest();
    
    //capture the response and store it in a variable
    request.onreadystatechange = function(){
        if(request.readyState== XMLHttpRequest.DONE){

            //take some action
            if(request.status==200){
                var counter= request.responseText;
                 var span = document.getElementById('count');
                  span.innerHTML=counter.toString();

            }
        }
        
        // not done yet
    };
    
    
    // make a request 
    request.open('GET', 'http://kamranjmi12.imad.hasura-app.io/counter', true);
    request.send(null);
    
    //render the variable in the correct span
   // counter= counter + 1;
    //var span = document.getElementById('count');
    //span.innerHTML=counter.toString();
    
};

//Submit names
var nameInput= document.getElementById('name');
var name= nameInput.value;
var submit= document.getElementById('submit_btn');
submit.onclick= function() 
{
 var request= new XMLHttpRequest();
    
    //capture the response and store it in a variable
    request.onreadystatechange = function(){
        if(request.readyState== XMLHttpRequest.DONE){

            //take some action
            if(request.status==200){
               //capture a list of names and render it as a list
                   var names= request.responseText;
                   names=JSON.parse(names);
                   var list='';
                   for (var i=0; i< names.length; i++) 
                   {
                    list+= '<li>' + names[i] + '</li>';   
                   }
                  var ul= document.getElementById('namelist');
                  ul.innerHTML=list;
                 
            }
        }
        
        // not done yet
    };
    
    
    // make a request 
    request.open('GET', 'http://kamranjmi12.imad.hasura-app.io/submit-name?name=' + name, true);
    request.send(null);
  
  
   
  
  
  
  
};