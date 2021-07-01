// import * as $ from 'jquery'; 

// class LazyLoadComponent {

//     private $componentSelector: JQuery; 
    
//     constructor($theComponentSelector: JQuery) { 
//         this.$componentSelector = $theComponentSelector;
//         this.init();
//     }

//     init(): void {
//         if ( !$(this).hasClass('animated') ) {
//             $(this).lazy({
//                 effect: "fadeIn",
//                 effectTime: 500,
//                 threshold: 650,
//                 removeAttribute: false,
//                 onError: function(element: any) {
//                     console.log('Error loading ' + element.data('src'));
//                 }
//             });
//         } else {
//             $(this).lazy({
//                 onError: function(element: any) {
//                     console.log('Error loading ' + element.data('src'));
//                 }
//             });
//         }
//     }
// }

// $(() => {
//     let lazyLoadComponentHolder = '.lazy';
    
//     $(lazyLoadComponentHolder).each(function(): void {
//         let lazyLoadComponent: any = new LazyLoadComponent($(this));
//     });
// });