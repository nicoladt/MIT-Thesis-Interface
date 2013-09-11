/* Utilities needed for Annotation Dashboard 
 *
 * Ewald Zietsman 
 * 2013
 *
 * */


var DashUtils = {

    capitaliseFirstLetter: function(string){
        return string.charAt(0).toUpperCase() + string.slice(1)
    },

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
        var entrytypes = new Array();
        entrytypes['errata'] = $('<span class="badge badge-important">Errata</span>');
        entrytypes['suggestion'] = $('<span class="badge badge-info">Suggestion</span>');
        entrytypes['comment'] = $('<span class="badge badge-success">Comment</span>');
        DashUtils.clearAnnotationTable();
        
        var i;
        for (i = 0; i < annotations.length; i++) {
            var row = $('<tr></tr>');
            var annotation = annotations[i];
            // type column only gets the type
            var typeentry = $('<td></td>');
            // add a bootstrap badge to show the type of annotation
            typeentry.append(entrytypes[annotation.type].clone());
            
            // annotation info gets 7 divs
            var subjectdiv = $('<div class="subject"></div>').text(annotation.subject);
            var gradediv = $('<div class="grade"></div>').text(annotation.grade);
            var chapternumberdiv = $('<div class="chapternumber"></div>').text(annotation.chapter);
            var chaptertitlediv = $('<div class="chaptertitle"></div>').text(annotation.chaptertitle);

            var annentry = $('<td class="annotation-entry"></td>');
            var urldiv = $('<div class="url"/>').html('<a href="' + annotation.url + '">' + annotation.url + "</a>");
            var hldiv = $('<div class="highlighted"/>').html(annotation.highlight);
            var commentdiv = $('<div class="comment"/>').html(annotation.comment);

            annentry.append(subjectdiv);
            annentry.append(gradediv);
            annentry.append(chapternumberdiv);
            annentry.append(chaptertitlediv);
            annentry.append(urldiv);
            annentry.append(hldiv);
            annentry.append(commentdiv);
            
            // number of replies
            var replyentry = $('<td class="replies-entry"/>');
            replyentry.html(annotation.replies.length);

            // date
            var dateentry = $('<td class="date-entry"/>');
            dateentry.html(annotation.time);
            
            // add everything to table
            row.append(typeentry);
            row.append(annentry);
            row.append(replyentry);
            row.append(dateentry);
            table.append(row);
        }
           //TODO Call the table sorter to update the table 
        
        // if table is empty, place a message in the table.
        var tableLength = $('.annotation-table tr').length;

        if (tableLength == 1) {
            var row = $('<tr class="table-empty-message"><td/><td>No results to display</td><td/><td/></tr>');
            table.append(row);
        }

    },

    /* Remove all entries from the table */
    clearAnnotationTable: function() {
        $('.annotation-table > tbody > tr').each(function() {
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
            
            // if its there already, do nothing, else eventhandlers go walkabouts
            if ($('div.' + fieldname +'-filter > div.filter').length === 0){
                var subjectdiv = $('div.' + fieldname +'-filter');
                for (var s in field) {
                    var divclass = field[s].replace(' ', '').toLowerCase();
                    var label = $("<div></div");
                    label.fadeTo(10, 0.5);
                    label.addClass('filter');
                    label.addClass(divclass);
                    // add colour for type of filter.
                    if (fieldname === 'type'){
                        var entrytypes = new Array();
                        entrytypes['errata'] = $('<span class="badge badge-important">Errata</span>');
                        entrytypes['suggestion'] = $('<span class="badge badge-info">Suggestion</span>');
                        entrytypes['comment'] = $('<span class="badge badge-success">Comment</span>');
                        label.prepend($('<input type="checkbox" checked/>'));
                        label.append(entrytypes[field[s]]);
                        
                    }
                    else{
                        label.text(' ' + field[s]);
                        label.prepend($('<input type="checkbox" checked/>'));
                    }
                    subjectdiv.append(label);

                    
                }
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
            annotations[i].chaptertitle = DashUtils.capitaliseFirstLetter(split[3]);
        }

    },


    /* Register event handlers
     */
    registerEventHandlers: function () {
        // functionality for the 'all' checkbox in the filterboxes
        // if all is checked, select all in filterbox
        // if all is unchecked, uncheck all in filterbox
        $('.checkbox.all > input').on('click', function (event) {
            if (this.checked === true){
                // make all siblings checked too
                $(this).parent().siblings('div').children('input')
                .each(function(){
                    $(this).prop('checked', true)
                    $(this).parent().fadeTo(50, 0.5);
                    });

                // update the table and filter boxes
                DashUtils.populateAnnotationTable(annotationList);
                DashUtils.setupFilterBoxes(annotationList);
            }
            else {
                // make all siblings checked too
                $(this).parent().siblings('div').children('input')
                .each(function(){
                    //$(this).prop('checked', false);
                    $(this).parent().fadeTo(50, 1.0);
                    });
            }
        });

        // If any other filter button is unchecked, uncheck the all button too
        $('div > input').on('click', function (event){
            var allbutton = $(this).parent().parent().find('.checkbox.all > input');
            var state = allbutton.prop('checked');

            if (state === true){
                // make the one clicked on checked
                $(this).prop('checked', true);
                allbutton.prop('checked', false);
                allbutton.trigger('change'); 
                $(this).parent().siblings('div').fadeTo(50, 1.0);
                $(this).parent().fadeTo(50, 1.0);
                // uncheck the other filter boxes
                $(this).parent().siblings('div').children('input').each(function(){
                    $(this).prop('checked', false);
                    });

            }
            else {
                // if the all button is not checked.
                $(this).parent().parent().find('div > input').each(function(){
                    if (!$(this).prop("checked")){
                       var allbutton = $(this).parent().parent().children('label').children('input');
                       allbutton.prop('checked',false);
                       // unfade the other checkboxes
                       $(this).parent().siblings('div').fadeTo(50, 1.0);
                       $(this).parent().fadeTo(50, 1.0);
                    }

                    });

               //// if the allbutton changes state, trigger the change event on it
               //if (allbutton.prop('checked') !== state){
               //    $(this).parent().parent().find('.checkbox.all > input').trigger('change');
               //}
            }   


        });


        // When any filter button changes state, update the table
        $('.filter>input').on("click", function() {
            var activeFilter = DashUtils.findallCheckedBoxes();
            var updatedAnnotationList = new Array();
            // now loop through the annotation list and only push the visible ones
            // to updatedAnnotationList
            var i;
            var j;
            var filterclass;
            var thisSubject, thisGrade, thisChapter, thisType;
            for (i = 0; i < annotationList.length; i++){
                thisSubject = annotationList[i].subject.toLowerCase().replace(' ','');
                thisGrade = annotationList[i].grade.toLowerCase().replace(' ','');
                thisChapter = annotationList[i].chapter;
                thisType = annotationList[i].type;
                // Check if annotation in list is shown in active Filter
                if (DashUtils.containsObject(thisSubject, activeFilter.subject) || activeFilter.subject[0] === 'all'){
                    if (DashUtils.containsObject(thisGrade, activeFilter.grade) || activeFilter.grade[0] === 'all'){
                        if (DashUtils.containsObject(thisChapter, activeFilter.chapter) || activeFilter.chapter[0] === 'all'){
                            if (DashUtils.containsObject(thisType, activeFilter.type) || activeFilter.type[0] === 'all'){
                                updatedAnnotationList.push(annotationList[i]);
                            } // if type
                        } // if chapter
                    } // if grade
                } // if subject
            } // i
            DashUtils.populateAnnotationTable(updatedAnnotationList);
            DashUtils.setupFilterBoxes(updatedAnnotationList);

        });

        // When reset button is clicked, "All" checkboxes are selected
        $('#reset-button').on("click", function() {
		$('label.checkbox.all > input').each(function(){
			$(this).trigger("clicked");
			$(this).prop("checked", true);
		});
		$('div.filter > input').each(function(){
			$(this).prop('checked', true);
                   	$(this).parent().fadeTo(50, 0.5);
		});
	
            console.log("Reset all the things");
	

	    DashUtils.populateAnnotationTable(annotationList);
        DashUtils.setupFilterBoxes(annotationList);

        });
    },


    /* find all the checked checkboxes
     */
    findallCheckedBoxes: function(){
        var activeFilter = {
            subject: [],
            grade: [],
            chapter: [],
            type: []
        };

        var allBox;

        $('input[type="checkbox"]').each(function() {
            if ($(this).prop('checked')){
                var thisFilterClass = $(this).parent().parent().prop('class');
                
                if (thisFilterClass.indexOf('subject') != -1){
                    activeFilter.subject.push($(this).parent().prop('class').split(' ')[1]);
                }
                else if (thisFilterClass.indexOf('grade') != -1){
                    activeFilter.grade.push($(this).parent().prop('class').split(' ')[1]);
                }
                else if (thisFilterClass.indexOf('chapter') != -1){
                    activeFilter.chapter.push($(this).parent().prop('class').split(' ')[1]);
                }
                else if (thisFilterClass.indexOf('type') != -1){
                    activeFilter.type.push($(this).parent().prop('class').split(' ')[1]);
                }
            }
        });
        return activeFilter;
    },
};

DashUtils.processAnnotations(annotationList);
DashUtils.populateAnnotationTable(annotationList);
DashUtils.setupFilterBoxes(annotationList);
DashUtils.registerEventHandlers();
