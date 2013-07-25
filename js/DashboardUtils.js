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

        if (domain.indexOf("maths") !== -1 && chapter.indexOf("math") === -1){
            subject = "Mathematics";
        }
        
        else if (chapter.indexOf("math") !== -1){
            subject = "Mathematical Literacy";
        }

        else if (domain.indexOf("science") !== -1){
            subject = "Physical Sciences";
        }

        return [grade, subject, chapnum, chaptitle]

    },

};

var a = document.getElementsByTagName('a');

for (var i=0; i < a.length; i++){console.log(a[i])};
