//Calls TableSorter 
$(document).ready(function() 
    { 
        $("table").tablesorter(); 
    } 
); 

annotationList = new Array();

$.ajax({
    type:"GET", 
    url: "../data/annotations.xml",
    async:false,
    dataType: "xml",
    success: function(data){
        var xml;
        xml = data;
        // Returned data available in object "xml"
        // Parse the xml
        xmlDoc = $.parseXML(xml);
        $xml = $(xmlDoc);
        $(xml).find("annotation").each( function (index){
            var url = $(this).find('url');
            var username = $(this).find('username');
            var datetime = $(this).find('annotation>datetime');
            var highlighted = $(this).find('highlighted');
            var comment = $(this).find('annotation>comment');
            var anntype = $(this).attr('type');
            var replies = $(this).find('reply');

            var table = $('.annotation-table');
            var row = $('<tr></tr>');
            
            // Create annotation object
            var annotation = new Object ();
            annotation.username = username.text()
            annotation.url = url.text();
            annotation.highlight = highlighted.text();
            annotation.comment = comment.text();
            annotation.time = datetime.text();
            annotation.type = anntype;
            annotation.replies = new Array();

            // Add all the replies
            replies.each(function() {
                var reply = new Object();
                reply.username = $(this).find('username').text()
                reply.comment = $(this).find('comment').text()
                reply.time = $(this).find('datetime').text()
                annotation.replies.push(reply)
            
            });

            annotationList.push(annotation);

        });
    }
 });
 
//TableSorter bitsie. URL: http://tablesorter.com/docs/ 
//$(document).ready(function() 
//    { 
//      $("#myTable").tablesorter(); 
//    } 
//); 


