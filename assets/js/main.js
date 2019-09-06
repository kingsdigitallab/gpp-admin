$(document).ready(function() {
    // style border for preferred names and identities
    $( "fieldset:has(input[name*='preferred']:checked)" ).addClass('border-left');

    $("input[name*='preferred']").change((el) => {
        $(el.target).parents('fieldset').first().addClass('border-left');
    });

    $('.toggle-tab-button').click((event) => {
        $(event.target).parents('.fieldset-header').siblings('.fieldset-body').toggleClass('expand');
        $(event.target).toggleClass('active');
    })

    $('.richtext').richText();

});

function addField(el) {
    $(el).before($(el).prev('.optional-to-delete').get(0).outerHTML);
}

function deleteField(el) {
    if ($(el).parent('.optional-to-delete').siblings('.optional-to-delete').length >= 1) {
        $(el).parent('div').remove();
    }
}


function addBlock(el) {
    $(el).parent().before($(el).parent().siblings('fieldset').get(0).outerHTML);
}

function deleteBlock(el) {
    $(el).parents('.optional-to-delete').first().remove();
}