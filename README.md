# Capture.js
Generic framework js to capture all the page events and store it.
Usage
Add jquery reference in the web page.
Add reference to capture.js file in ur masterpage, and provide the class capture to the container div.
All the elements inside the container div are tracked for events, and stored in the array.

jQuery(document).ready(function($){
    var interaction = new Capture({
        interactions: true,
        interactionElement: "capture",
        interactionEvents: ["mouseup", "touchstart", "touchend"],
    });
