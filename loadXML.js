$.ajax({
    type:"GET", 
    url: "annotations.xml",
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
            datetime = $(this).find('datetime');
            highlighted = $(this).find('highlighted');
            comment = $(this).find('comment');

            console.log(url.text());
            console.log(username.text());
            console.log(datetime.text());
            console.log(highlighted.text());
            console.log(comment.text());
        });
}
 });
