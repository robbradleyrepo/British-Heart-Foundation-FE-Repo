import { SessionStorageBase } from "../core/session-storage";
import { Engraving } from "../core/engraving-item";

class EngravingListComponent {
    private $componentSelector: JQuery;
    private storageHolder: SessionStorageBase;
    private addButton: JQuery;
    private itemContext: string;
    private modalOptions: Object;

    constructor($theComponentSelector: JQuery) {
        this.$componentSelector = $theComponentSelector;
        this.addButton = this.$componentSelector.find('.cta__add-item');
        this.modalOptions = {
            fadeDuration: 250
        };
        this.init();
    }

    init(): void {
        var that = this;
        this.storageHolder = new SessionStorageBase();

        this.addButton.on('click', function (e) {
            //clear the modal fields
            if (!$(this).hasClass('disabled')) {
                that.updateModalFields('', '', '', '');
                $('.engraving-name').parsley().reset();
                $('.day-input').parsley().reset();
                $('.month-input').parsley().reset();
                $('.year-input').parsley().reset();

                $('.basket-edit-item__label').removeClass('hidden');
                $('.basket-edit-item__alternative-label').addClass('hidden');

                $('.basket-edit-item .add-button').removeClass('hidden');
                $('.basket-edit-item .update-button').addClass('hidden');

                $('.basket-edit-item').modal(that.modalOptions);
            }
        });

        $('.basket-edit-item .cta').on('click', () => {
            $('.engraving-name').parsley().validate();
            if ($('.parsley-error').length == 0 && $('.engraving-name').val().toString().length > 0) {
                let name, day, month, year;
                name = $('.engraving-name').val().toString();
                day = $('.day-input').val().toString();
                month = $('.month-input').val().toString();
                year = $('.year-input').val().toString();
                if ($('.basket-edit-item').hasClass('edit-mode')) {
                    that.updateEngraving(name, day, month, year);
                } else {
                    that.addEngraving(name, day, month, year);
                }
            }
        });

        $('.basket-remove-item .remove-item').on('click', () => {
            that.deleteEngraving(that.itemContext);
            let itemSelector = '.c-inventory-basket__item[data-key="' + that.itemContext + '"]';
            let itemToRemove = that.$componentSelector.find(itemSelector);
            itemToRemove.remove();
            if ($('.c-inventory-basket__container').children().length == 0) {
                $('.continue-button').addClass('hidden');
            }
        });

        that.attachItemEvents();

        $('.engraving-guidelines').on('click', (e) => {
            e.preventDefault();
            $('.modal-guidelines').modal(that.modalOptions);
        });

        $('.f-forms-modal').on($.modal.OPEN, function () {
            $(this).toggleClass('closed');
            $('body').addClass('overflow-hidden');
        });

        $('.f-forms-modal').on($.modal.CLOSE, function () {
            $(this).toggleClass('closed');
            $('body').removeClass('overflow-hidden');
        });

        $('.day-input, .month-input').on('focusout', function () {
            let inputValue: string = $(this).val().toString();
            if (inputValue.length == 1 && inputValue != "0") {
                $(this).val("0" + inputValue);
            }
        });

        $('.f-forms-modal__content').on('scroll', function () {
            if ($('.f-forms-modal__content').scrollTop() > 0) {
                $('.modal-scrollable').addClass('scrolling');
            } else {
                $('.modal-scrollable').removeClass('scrolling');
            }
        })

    }

    attachItemEvents(): void {
        var that = this;
        this.$componentSelector.find('.c-inventory-basket__edit').off('click').on('click', function (e) {
            //open a modal to enter data with inputs already populated with engraving data
            e.preventDefault();
            that.itemContext = $(this).closest('.c-inventory-basket__item').data('key');
            let selectedItem: any = that.storageHolder.getItem(that.itemContext);
            that.updateModalFields(selectedItem.name, selectedItem.day, selectedItem.month, selectedItem.year);
            $('.basket-edit-item__label').addClass('hidden');
            $('.basket-edit-item__alternative-label').removeClass('hidden');

            $('.basket-edit-item .add-button').addClass('hidden');
            $('.basket-edit-item .update-button').removeClass('hidden');

            $('.basket-edit-item').addClass('edit-mode');
            $('.basket-edit-item').modal(that.modalOptions);
        });

        this.$componentSelector.find('.c-inventory-basket__delete').off('click').on('click', function (e) {
            e.preventDefault();
            that.itemContext = $(this).closest('.c-inventory-basket__item').data('key');
            $('.basket-remove-item').modal(that.modalOptions);
        });
    }

    //call this from the modal handling new engraving
    addEngraving(name: string, day: string, month: string, year: string): void {
        let engraving = new Engraving(name, day, month, year);
        let key = new Date().getTime().toString();
        this.storageHolder.setItem(key, engraving);
        this.itemContext = key;
        let newlyAddedItem: JQuery = this.updateBasketItem(name, day, month, year, true);
        newlyAddedItem.attr('data-key', key);
        $('.continue-button').removeClass('hidden');
        this.attachItemEvents();

        if (this.storageHolder.getItemsCount() == 1) {
            $('.inventory-title').removeClass('hidden');
            this.$componentSelector.addClass('top-border');
            $('.cta-label__first-line').addClass('hidden');
            $('.cta-label__first-line-alternative').removeClass('hidden');
        }
        if (this.storageHolder.getItemsCount() == 10) {
            $('.max-basket-items').removeClass('hidden');
            this.addButton.addClass('disabled');
        }

        $.modal.close();

    }

    updateEngraving(name: string, day: string, month: string, year: string): void {
        var that = this;
        let engraving = new Engraving(name, day, month, year);
        that.storageHolder.setItem(that.itemContext, engraving);
        $.modal.close();
        $('.basket-edit-item').removeClass('edit-mode');
        this.updateBasketItem(name, day, month, year, false);
        this.attachItemEvents();
    }

    //call this from the modal after confirming delete engraving
    deleteEngraving(key: string): void {
        this.storageHolder.deleteItem(key);
        if (this.storageHolder.getItemsCount() < 10) {
            $('.max-basket-items').addClass('hidden');
            $(this.addButton).removeClass('disabled');
        }

        if (this.storageHolder.getItemsCount() == 0) {
            $('.continue-button').addClass('hidden');
            $('.inventory-title').addClass('hidden');
            this.$componentSelector.removeClass('top-border');
            $('.cta-label__first-line').removeClass('hidden');
            $('.cta-label__first-line-alternative').addClass('hidden');
        }

        $.modal.close();
    }

    updateModalFields(name: string, day: string, month: string, year: string): void {
        $('.engraving-name').val(name);

        if (day.length == 0) {
            $('.day-input').parsley().reset();
            $('.day-input').val('');
        } else {
            $('.day-input').val(day);
        }

        if (month.length == 0) {
            $('.month-input').parsley().reset();
            $('.month-input').val('');
        } else {
            $('.month-input').val(month);
        }

        if (year.length == 0) {
            $('.year-input').parsley().reset();
            $('.year-input').val('');
        } else {
            $('.year-input').val(year);
        }
    }

    updateBasketItem(name: string, day: string, month: string, year: string, isNew: boolean): JQuery {
        let date = '', namePart = '', datePart = '', controlsPart = '';
        if (day || month || year) {
            date = day + '.' + month + '.' + year;
        }

        namePart = '<span class="c-inventory-basket__name">' + name + '</span>';

        if (date.length > 0) {
            datePart = '<span class="c-inventory-basket__date">' + date + '</span>';
        }

        controlsPart = '<div class="c-inventory-basket__controls"><a href="" class="c-inventory-basket__edit">Edit</a><a href="" class="c-inventory-basket__delete">Delete</a></div></div>';

        if (!isNew) {
            //if we're updating the item
            let itemSelector = '.c-inventory-basket__item[data-key="' + this.itemContext + '"]';
            let itemToUpdate = this.$componentSelector.find(itemSelector);
            let htmlToInsert = namePart;
            if (date.length > 0) {
                htmlToInsert += datePart;
            }
            htmlToInsert += controlsPart;
            itemToUpdate.html(htmlToInsert);
        } else {
            //creating new item
            let basketItemHtml: string = '<div class="c-inventory-basket__item"><span class="c-inventory-basket__name">' +
                name + '</span>';
            if (date.length > 0) {
                basketItemHtml += datePart;
            }
            basketItemHtml += controlsPart;
            $(basketItemHtml).appendTo('.c-inventory-basket__container');
        }
        return $('.c-inventory-basket__item').last();
    };
}

$(() => {
    let engravingListHolder = '.c-inventory-basket';

    $(engravingListHolder).each(function (): void {
        let engravingListComponent: any = new EngravingListComponent($(this));
    });
});