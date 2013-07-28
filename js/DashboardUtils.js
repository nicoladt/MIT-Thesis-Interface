/* Utilities needed for Annotation Dashboard 
 *
 * Ewald Zietsman 
 * 2013
 *
 * */


var DashUtils = {

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
            typeentry.html(annotation.type);
            
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


    /*
     * Set up the filter boxes using the given list of annotations
     * */
    setupFilterBoxes: function(annotationList) {
        var subjects = new Array();
        var grades = new Array();
        var chapters = new Array();
        var types = new Array();

        // go through the annotations
        for (var i in annotationList) {
            var annotation = annotationList[i];
            // go through each property of the annotation
            var properties = ["subject", "grade", "chapter", "type"];
            var prop;
            var j;
            for (j = 0; j < properties.length; j++) {
                prop = properties[j];
                switch (prop)
                {
                    case "subject":
                        subjects.push(annotation[prop]);
                        break;

                    case "grade":
                        grades.push(annotation[prop]);
                        break;

                    case "chapter":
                        chapters.push(annotation[prop]);
                        break;

                    case "type":
                        types.push(annotation[prop]);
                        break;
                }
            }
        } 

        // get the unique sets
        subjects = DashUtils.toSet(subjects);
        grades = DashUtils.toSet(grades);
        types = DashUtils.toSet(types);
        chapters = DashUtils.toSet(chapters);
        var fields = [subjects, grades, types, chapters];

        subjects.sort();
        grades.sort();
        types.sort();
        chapters.sort();

        // Now populate the filter boxes
        // Loop through different filters
        for (var i in fields){
            var field = fields[i];
            var fieldname;
            switch (field)
            {
                case subjects:
                    fieldname = 'subject';
                    break;
                case grades:
                    fieldname = 'grade';
                    break;
                case types:
                    fieldname = 'type';
                    break;
                case chapters:
                    fieldname = 'chapter';
                    break;
            }
            /*
             * This creates an element
             *  <div class="fieldname-filter>
             *      <input class="checkbox">
             *      Labeltext
             *  </div>
             */
            var subjectdiv = $('div.' + fieldname +'-filter');
            for (var s in field) {
                var divclass = field[s].replace(' ', '').toLowerCase();
                var label = $("<div></div");
                label.addClass(divclass);
                label.text(' ' + field[s] + "\n");
                label.prepend($('<input type="checkbox"/>'));
                subjectdiv.append(label);
            }
        }
    },


    /*
     * Process the Annotations in the list. Add data contained in url in new fields.
     * */ 
    processAnnotations: function(annotations){
        var i;
        for (var i in annotations) {
            var split = this.spliturl(annotations[i].url);
            annotations[i].grade = split[0];
            annotations[i].subject = split[1];
            annotations[i].chapter = split[2];
        }

    },

    
};

DashUtils.processAnnotations(annotationList);
DashUtils.populateAnnotationTable(annotationList);
DashUtils.setupFilterBoxes(annotationList);
