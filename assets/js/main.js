$(document).ready(function() {

    // object for popups that appear when users hover over question marks 
    var additionalInfo = {'general-date-from': 'some information'};

    // check if additional information for the field exists to display the question mark icon
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

function updateAttribute(idToIncrement, name) {
    var regex = new RegExp('(?<='+idToIncrement + '-)[0-9]+');
    var name = name.replace(regex, (n) => {return ++n});
    return name;
}

function addField(el) {
    var template = $(el).parent().prev().clone();
    var idToIncrement = template.first().attr('data-content-reference');
    if (idToIncrement) {
        template.find('*[name]').each((i, elHasName) => {
            if (elHasName.name && elHasName.name.includes(idToIncrement)) {
                var newName = updateAttribute(idToIncrement, elHasName.name);
                elHasName.name = newName;
            }
        })
    }
    template.find("input[type=text], input[type=date], textarea").val("");
    $(el).parent().before(template);
}

function addBlock(el) {
    var template = $(el).parent().prev('fieldset').clone();
    var idToIncrement = template.closest('fieldset').attr('data-content-reference');
    if (idToIncrement) {
        template.find('*[name]').each((i, elHasName) => {
            if (elHasName.name && elHasName.name.includes(idToIncrement)) {
                var newName = updateAttribute(idToIncrement, elHasName.name);
                elHasName.name = newName;
            }
        })
    }
    template.find("input[type=text], input[type=date], textarea").val("");
    $(el).parent().before(template);
}

// update entity name part fields if the 'Royal name' checkbox is checked
function updateBlock(el) {
    var val= el.name.slice(0, -10);
    if($(el).is(":checked")){
        $(el).siblings('.required-fields').html(`
            <div class="grid">
                <span class="required">Forename(s)</span>
                <input type="text" placeholder="Forename(s)" onfocus="this.placeholder=''" onblur="this.placeholder='Forename(s)'" value="" aria-label="forename" name="`+ val +`forename"/>
            </div>
            <div class="grid">
                <span class="required">Proper title</span>
                <input type="text" placeholder="Proper title" onfocus="this.placeholder=''" onblur="this.placeholder='Proper title'" value="" aria-label="proper title" name="`+ val +`proper-title"/>
            </div>
        `);
    }
    else if($(el).is(":not(:checked)")){
        $(el).siblings('.required-fields').html(`
            <div class="grid">
                <span class="required">Surname</span>
                <input type="text"  placeholder="Surname" onfocus="this.placeholder=''" onblur="this.placeholder='Surname'" value="" aria-label="surname" name="`+ val +`surname"/>
            </div>
        `);
    }
}

// var warningPopup =`<div class="warningPopup">
//                             <div class="modal-content">
//                                 <div class="modal-header">
//                                     <h2>Delete record?</h2>
//                                     <input type="button" class="icon-only" aria-label="close" onclick="closeBlock('modal')" value="&#xf00d;" />
//                                 </div>
//                                 <div class="modal-body">
//                                 </div>
//                                 <div class="modal-footer">
//                                     <input type="button" value="Cancel" class="default" onclick="closeBlock('modal')"/>
//                                     <input type="submit" value="Delete" class="danger" onclick=""/>
//                                 </div>
//                             </div>
//                         </div>`;

function closeBlock(el) {
    $('.'+el).removeClass('active');
}

function deleteField(el) {
    if ($(el).closest('.optional-to-delete').siblings('.optional-to-delete').length >= 1) {
        $(el).closest('.optional-to-delete').remove();
    }
}

function deleteBlock(el) {
    $(el).parents('.optional-to-delete').first().remove();
    $(el).parent().siblings('.optional-to-delete').each((i, parent) => {
        console.log(parent);
    });
}

function deleteRecord(el) {
    console.log('delete record');
}
