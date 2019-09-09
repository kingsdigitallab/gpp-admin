$(document).ready(function() {

    var additionalInfo = {'general-date-from': 'some information'};

    // check if additional information for the field exists
    $('.additional-info-icon').get().forEach((el) => {
        var key = $(el).attr("data-content-type");
        if (!additionalInfo[key]) {
            $(el).addClass('none');
        }
    });

    // style border for preferred names and identities
    $( "fieldset:has(input[name*='preferred']:checked)" ).addClass('border-left');

    // change border of the preferred section
    $("input[name*='preferred']").change((el) => {
        $(el.target).parents('fieldset').first().addClass('border-left');
    });

    // expand/collapse entity/archival record sections
    $('.toggle-tab-button').click((event) => {
        $(event.target).parents('.fieldset-header').siblings('.fieldset-body').toggleClass('expand');
        $(event.target).toggleClass('active');
    })

    // open popup to log changes in entity/archival record sections
    $("#record-form").submit((event) => {
        event.preventDefault();
        $(".modal").addClass('active');
    });

    // merge values from the modal and record forms
    $('#record-modal-form').submit((event) => {
        event.preventDefault();
        var formVals = $('#record-form, #record-modal-form').serialize();
        $('.modal-footer').append('<p style="white-space: nowrap; overflow: scroll; max-width: 450px"><b>Merged values from forms:</b> ' + formVals + '</p>');
    });

    $('.additional-info-icon').on({
        mouseover: (el) => {
            var key = $(el.target).attr("data-content-type");
            var position = $(el.target).position();
            if (additionalInfo[key]) {
               $(el.target).before('<p class="additional-info" style="top:'+ (position.top - 35) + 'px; left:' + (position.left + 25) + 'px">' +additionalInfo[key]+ '</p>'); 
            }
        }, 
        mouseleave: (el) => {
            $(el.target).siblings('p').remove();
        }
    });

    // change textareas to richtext fields
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
    // $(el).parent().before($(el).parent().siblings('fieldset').get(0).outerHTML);
}

function deleteBlock(el) {
    $(el).parents('.optional-to-delete').first().remove();
}

function closeBlock(el) {
    $('.'+el).removeClass('active');
}

// add popups

// generate unique names for input fields
