declare var shareSelectedText: any;
declare var Sitecore: any;

class ShareSelectedTextComponent {

    private componentScope: string;

    constructor(componentScope:any) {
        this.componentScope = componentScope;

        if (!this.pageEditorMode()) {
            shareSelectedText(this.componentScope, {
                tooltipClass: '', // cool, if you want to customize the tooltip
                sanitize: true, // will sanitize the user selection to respect the Twitter Max length (recommended)
                buttons: [ // services that you want to enable you can add:
                    'facebook', // - twitter, tumblr, buffer, stumbleupon, digg, reddit, linkedin, facebook
                    'twitter'
                ],
                anchorsClass: '', // class given to each tooltip's links
                twitterUsername: '', // for twitter widget, will add 'via @twitterUsername' at the end of the tweet.
                facebookAppID: '2029712067316670', // Can also be an HTML element inside the <head> tag of your page : <meta property="fb:APP_ID" content="YOUR_APP_ID"/>
                facebookDisplayMode: 'popup', //can be 'popup' || 'page'
                tooltipTimeout: 250 //Timeout before that the tooltip appear in ms
            });
        }
    }

    pageEditorMode(): boolean {
        if (typeof Sitecore == "undefined") {
            return false;
        }
        if (typeof Sitecore.PageModes == "undefined" || Sitecore.PageModes == null) {
            return false;
        }
        return Sitecore.PageModes.PageEditor != null;
    };
}

$(() => {
    let theComponentHolder = '.c-text-component';
    
    $(theComponentHolder).each(function(): void {
        let theComponent: any = new ShareSelectedTextComponent(theComponentHolder);
    });
});