var Capture = function(config)
{
this.initialize(config);
};

Capture.prototype ={
initialize: function(config){
this.interactions = config.interactions|| true,
this.interactionElement = config.interactionElement|| 'interaction',
this.interactionEvents = config.interactionEvents|| ['mounseup','touchend'],
this.endpoint = config.endpoint || '/Savelog',
this.records=[];
this.loadTime= new Date();
this.register();
},
register : function()
{
var Interaction = this;
if(Interaction.interactions === true)
{
for (var i=0; i< Interaction.interactionEvents.length; i++){
var ev = Interaction.interactionEvents[i],
targets = document.getElementsByClassName(Interaction.interactionElement);
for(var j=0; j<targets.length; j++)
{
targets[j].addEventListener(ev, function(e){
Interaction.track(e,"interaction");
});
}
}
}

window.onbeforeunload = function(e) {
Interaction.post();
};
},
track : function(e, type)
{
var Interaction = this,
interaction = {
type : type,
event : e.type,
targetTag : e.target!= undefined? e.target.tagName:"",
content : e.target!= undefined ? e.target.innerText:"",
createdAt:new Date()
};
Interaction.records.push(interaction);
return this.interactions;
},
post : function()
{
var Interaction = this,
data = {
loadTime : Interaction.loadTime,
unloadTime: new Date(),
language: window.navigator.language,
platform : window.navigator.platform,
port:window.location.port,
page:{
pagename : document.title,
location : window.location.pathname,
href:window.location.href,
origin:window.location.origin,
parameters:this.parseQuerystring(),
loadtime:window.performance.timing.loadEventEnd - window.performance.timing.loadEventStart + " milliseconds"
},
interactions:Interaction.records
},
ajax = new XMLHttpRequest();
ajax.open('POST',Interaction.endpoint,false);
ajax.setRequestHeader('Content-Type','application/json;charset=UTF-8');
ajax.send(JSON.stringify(data));
},
parseQuerystring: function()
{
var url = window.location.href,
retObject = {},
parameters;
if(url.indexOf('?')=== -1)
{
return  null;
}
url = url.split('?')[1];
parameters = url.split('&');
for(var i=0;i< parameters.length; i++)
{
returnObject[parameters[i].splice('=')[0]]= parameters[i].split('=')[1];
}
return retObject;
}
};
