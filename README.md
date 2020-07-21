# frontplate
A simple and custom frontend boilerplate with Gulp build systems

## Environment configuration
* Install Node JS
* Install Ruby
* In command line run 'gem install sass'. If see the error try 'sudo gem install sass'
* In command line run as Administrator 'npm install --global --production windows-build-tools'. This will install Python 2.7.13 and MS BuildTools_Full to your machine including other things. 
* If see 'self signed certificate in certificate chain' error, in command line run 'npm config set registry http://registry.npmjs.org/' and 'npm config set strict-ssl false'.
* If error persists run 'git config --global http.sslVerify false' 

### Installation
```
$ npm install  // install packages
```

### Usage
```
$ gulp default  // build development distribution
```

#### Available Gulp tasks
- `$ gulp lint` to lint TypeScript
- `$ gulp scripts` to build JavaScript from TypeScript
- `$ gulp styles` to build styles from sass
- `$ gulp images` to build images
- `$ gulp fonticon` to convert SVG icons into icon font
- `$ gulp fonts` to copy font files across
- `$ gulp pages` to build static pages from nunjucks
- `$ gulp serve` to populate the assets and open browser pointing to index.html
- `$ gulp clean` to clean up distribution and temporary files
- `$ gulp [task] --env production` to build production distribution

#### For live build and TeamCity
Run 'gulp default --env production' [minification]

### Development - Forms
* Global dependencies - jQuery 3, Parsley, Easy Autocomplete, AutoSize, Modal, Idle.
* Forms v1 is defined with the master scope class "g-forms"
* Forms v2 is defined with the master scope class "f-forms"
* All field elements are defined by whether they are CORE or CUSTOM:
* Core Elements consist or generic INPUT, TEXTAREA, SELECT, BUTTONS etc.
* Custom Elements consist of specific variations of Core Elements, with custom validation as defined via Parsley JS v2xx [http://parsleyjs.org/]. Eg: TITLE, FIRST NAME, SURNAME etc.
* HTML contained within src/forms/ and seperated into core, custom and products.
* Core and Custom as defined above. Products are combinations or examples of the previous, which constitute a fully functional form from a FE perspective.
* SASS contained within sass/forms/ with subdirs core and products. There should no reason to have a custom CSS subir for any forms in v2.
* Forms v2 JS now wholly isolated and contained within mvc-forms.js 

#### API configuration for UAT/UAT2 [CORS]
* In order to communicate with APIs on UAT/UAT2 configure CORS inconjunction with a BE dev in sitecore.
* Apply to webcconfig
```
<customHeaders>
    <add name="Access-Control-Allow-Origin" value="*" />
    <add name="Access-Control-Allow-Methods" value="GET,PUT,POST,DELETE,OPTIONS" />
    <add name="Access-Control-Allow-Headers" value="Content-Type" />
    <remove name="X-Powered-By" />
</customHeaders>
```
* Apply to global.asax within *Application_BeginRequest*
```
if (HttpContext.Current.Request.HttpMethod == "OPTIONS") {
    HttpContext.Current.Response.AddHeader("Cache-Control", "no-cache");
    HttpContext.Current.Response.AddHeader("Access-Control-Allow-Methods", "GET, POST");
    HttpContext.Current.Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
    HttpContext.Current.Response.AddHeader("Access-Control-Max-Age", "1728000");
    HttpContext.Current.Response.End();
}
```
* All API urls should be defined in markdown - not in JS.