import * as $ from 'jquery'; 

class SocialShare {

    private $componentSelector: JQuery; 
    private pageTitle: String;
    private metaDesc: String;
    private contentPicture: String;
    private domain: String;
    private currentURL: String;
    
    constructor($theComponentSelector: JQuery) { 
        this.$componentSelector = $theComponentSelector;
        this.pageTitle = $(document).find("title").length ? $(document).find("title").text() : 'BHF';
        this.metaDesc = $('meta[name=description]').length ? $('meta[name=description]').attr("content") : 'Alternative description';
        this.contentPicture = $('.c-text').find('img').first().length ? $('.c-text').find('img').attr("src") : $('.site-logo').find('img').attr("src");
        this.domain = location.host;
        this.currentURL = window.location.href;
        this.init();
    }

    init() :void {
        var that = this;
        this.$componentSelector.on('click', function (event) {
            event.preventDefault();
    
            switch($(this).attr('title').toLowerCase()) {
                // Constructing share URLs depending on which
                // social media network icon was clicked
                case 'linkedin':
                    var linkedinShareUrl = encodeURI('https://www.linkedin.com/shareArticle?mini=true&url=' + that.currentURL + '&title=' + that.pageTitle + '&summary=' + that.metaDesc + '&source=' + that.domain);
                    window.open(linkedinShareUrl, '_blank');
                    break;
                case 'facebook':
                    var facebookShareUrl = encodeURI('https://www.facebook.com/sharer.php?caption=' + that.pageTitle + '&description=' + that.metaDesc + '&u=' + that.currentURL + '&picture=' + that.contentPicture);
                    window.open(facebookShareUrl, '_blank');
                    break;
                case 'twitter':
                    var twitterShareUrl = encodeURI('https://twitter.com/intent/tweet?text=' + that.metaDesc.substring(0,101) + '...' + '&url=' + that.currentURL + '&via=TheBHF');
                    window.open(twitterShareUrl, '_blank');
                    break;
                case 'email':
                    var mailTo = encodeURI('mailto:?subject=' + that.pageTitle + '&body=' + that.metaDesc);
                    window.open(mailTo, '_self');
                    break;
                case 'print':
                    window.print();
                    break;
            }
        });
    }
}

$(() => {
    let socialShareComponentHolder = '.c-share-this__item';
    
    $(socialShareComponentHolder).each(function(): void {
        let socialShareComponent: any = new SocialShare($(this));
    });
});