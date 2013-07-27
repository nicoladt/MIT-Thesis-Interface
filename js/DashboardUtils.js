var DashUtils = {
/* Utilities needed for Annotation Dashboard 
 *
 * Ewald Zietsman 
 * 2013
 *
 * */


    /*
     * given an EMAS textbook section url, return the subject, grade, chapter number and chapter title
     */
    spliturl: function(url){
        var spliturl = url.split('/');
        var domain = spliturl[2];

        // Get grade string
        var grade = spliturl[3].replace(/-/g, ' ');

        //get chapter
        var chapter = spliturl[4];
        var chapnum = chapter.split('-')[0];
        var chaptitle = chapter.split('-').slice(1,chapter.length).join(' ');

        //get subject
        var subject;

        if (domain.indexOf("maths") !== -1 && grade.indexOf("math") === -1){
            subject = "Mathematics";
        }
        else if (grade.indexOf("math") !== -1){
            subject = "Mathematical Literacy";
        }
        else if (domain.indexOf("science") !== -1){
            subject = "Physical Sciences";
        }
        return [grade.slice(0,"grade xx".length), subject, chapnum, chaptitle]
    },

    /* Dummy function for testing
     */
    print_all_urls: function(){
        $("div.url > a").each(function(){
            console.log(DashUtils.spliturl($(this).text()));
        });
    },
    
    
    /* returns a list that is a unique set of strings
     */
    toSet: function(list){
        var i;
        var newlist = new Array();
        for (i = 0; i < list.length; i++){
            if (this.containsObject(list[i], newlist) === false){
                newlist.push(list[i])
            }
        }
        return newlist
    },


    /*
     * Get all the items of type field in the table
     * field: 'grade', 'chapnum', 'chaptitle', 'subject'
     */
    getAll: function(field){
        var index;

        var allgrades = new Array();
        $("div.url > a").each(function(){
            allgrades.push(DashUtils.spliturl($(this).text())[0]);
        });

        allgrades = this.toSet(allgrades);
        return allgrades
    },

    /* Check if obj is in list 
     */
    containsObject: function(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }

        return false;
    },

    /* Populate the annotation table
     * annotations: array containing Annotation objects
     */
    populateAnnotationTable: function(annotations) {
        var table = $('.annotation-table');

        var i;
        for (i = 0; i < annotations.length; i++) {
            var row = $('<tr></tr>');
            var annotation = annotations[i];
            // type column only gets the type
            typeentry = $('<td></td>');
            typeentry.html(anntype);
            
            // annotation info gets 3 divs
            annentry = $('<td class="annotation-entry"></td>');
            urldiv = $('<div class="url"/>').html('<a href="' + annotation.url + '">' + annotation.url + "</a>");
            hldiv = $('<div class="highlighted"/>').html(annotation.highlighted);
            commentdiv = $('<div class="comment"/>').html(annotation.comment);

            annentry.append(urldiv);
            annentry.append(hldiv);
            annentry.append(commentdiv);
            
            // number of replies
            replyentry = $('<td class="replies-entry"/>');
            replyentry.html(annotation.replies.length);

            // date
            dateentry = $('<td class="date-entry"/>');
            dateentry.html(annotation.time);
            
            // add everything to table
            row.append(typeentry);
            row.append(annentry);
            row.append(replyentry);
            row.append(dateentry);
            table.append(row);
        }
            
    },

    /* Remove all entries from the table */
    clearAnnotationTable: function() {

        $('.annotation-table  tr').each(function() {
            $(this).remove();
        });
        
    },

    
};

DashUtils.populateAnnotationTable(annotationList);
