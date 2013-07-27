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
            url = $(this).find('url');
            username = $(this).find('username');
            datetime = $(this).find('annotation>datetime');
            highlighted = $(this).find('highlighted');
            comment = $(this).find('annotation>comment');
            anntype = $(this).attr('type');
            replies = $(this).find('reply');

            table = $('.annotation-table');
            
            row = $('<tr></tr>');
            
            // Create annotation object
            var annotation = new Object ();
            annotation.username = username.text()
            annotation.url = url.text();
            annotation.highlight = highlighted.text();
            annotation.comment = comment.text();
            annotation.time = datetime.text();
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


