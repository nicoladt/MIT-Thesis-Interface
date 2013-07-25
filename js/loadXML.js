$.ajax({
    type:"GET", 
    url: "../data/annotations.xml",
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

            // type column only gets the type
            typeentry = $('<td></td>');
            typeentry.html(anntype);
            
            // annotation info gets 3 divs
            annentry = $('<td class="annotation-entry"></td>');
            urldiv = $('<div class="url"/>').html('<a href="' + url.text() + '">' + url.text() + "</a>");
            hldiv = $('<div class="highlighted"/>').html(highlighted.text());
            commentdiv = $('<div class="comment"/>').html(comment.text());

            annentry.append(urldiv);
            annentry.append(hldiv);
            annentry.append(commentdiv);
            
            // number of replies
            replyentry = $('<td class="replies-entry"/>');
            replyentry.html(replies.length);

            // date
            dateentry = $('<td class="date-entry"/>');
            dateentry.html(datetime.text());
            
            // add everything to table
            row.append(typeentry);
            row.append(annentry);
            row.append(replyentry);
            row.append(dateentry);
            table.append(row);

        });
}
 });
 
//TableSorter bitsie. URL: http://tablesorter.com/docs/ 
//$(document).ready(function() 
//    { 
//      $("#myTable").tablesorter(); 
//    } 
//); 


