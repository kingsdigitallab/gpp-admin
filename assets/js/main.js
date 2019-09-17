// object for popups that appear when users hover over question marks 
var additionalInfo = {
    'general-date-from': 'general-date-from', 
    'general-date-to': 'general-date-to', 
    'general-display-date': 'general-display-date',
    'display-name': 'display-name',
    'name-entity-language': 'name-entity-language',
    'name-entity-script': 'name-entity-script',
    'date-from': 'date-from',
    'date-to': 'date-to',
    'display-date': 'display-date',
    'gender': 'gender',
    'gender-descriptive-notes': 'gender-descriptive-notes',
    'gender-citation': 'gender-citation',
    'biography-abstract': 'biography-abstract',
    'biography-content': 'biography-content',
    'biography-structure-genealogy': 'biography-structure-genealogy',
    'biography-sources': 'biography-sources',
    'biography-copyright': 'biography-copyright',
    'language': 'language',
    'script': 'script',
    'place': 'place',
    'place-address': 'place-address',
    'place-role': 'place-role',
    'event': 'event',
    'event-place': 'event-place',
    'mandate-term': 'mandate-term',
    'mandate-descriptive-notes': 'mandate-descriptive-notes',
    'mandate-citation': 'mandate-citation',
    'legal-status-term': 'legal-status-term',
    'legal-status-descriptive-notes': 'legal-status-descriptive-notes',
    'legal-status-citation': 'legal-status-citation',
    'function': 'function',
    'relationship-type': 'relationship-type',
    'related-person-corporate-body': 'related-person-corporate-body',
    'relations-description': 'relations-description', 
    'relations-place': 'relations-place',
    'resource-relationship-type': 'resource-relationship-type',
    'resource-citation': 'resource-citation',
    'resource-url': 'resource-url',
    'resource-notes': 'resource-notes',
    'source-name': 'source-name',
    'source-url': 'source-url',
    'source-notes': 'source-notes',
    'control-language': 'control-language',
    'control-rights-declaration': 'control-rights-declaration',
    'control-script': 'control-script',
    'control-rights-abbreviation': 'control-rights-abbreviation',
    'control-rights-declaration': 'control-rights-declaration',
    'log-comments': 'how to log comments',
};

$(document).ready(function() {
    // check if additional information for the field exists to display the question mark icon
    $('.additional-info-icon').get().forEach((el) => {
        var key = $(el).attr("data-content-type");
        if (!additionalInfo[key]) {
            $(el).addClass('none');
        }
    });

    // open popup to log changes in entity/archival record sections
    $("#record-form").submit((event) => {
        event.preventDefault();
        // modal template is available in the files entity.html and archival-records.html (they use the same template with the same content)
        $(".modal").addClass('active');
    });

    // open popup to add new user who can access the admin panel
    $('#add-form').click(() => {
        $('#add-user-form').addClass('active');
    });

    // merge values from the modal and record forms
    $('#record-modal-form').submit((event) => {
        event.preventDefault();
        var formVals = $('#record-form, #record-modal-form').serialize();
        $('.modal-footer').append('<p style="white-space: nowrap; overflow: scroll; max-width: 450px;"><b>Merged values from forms:</b> ' + formVals + '</p>');
    });

    // display additional information about the fields on hover
    $('.additional-info-icon').on({
        mouseover: (el) => {
            var key = $(el.target).attr("data-content-type");
            var position = $(el.target).position();
            if (additionalInfo[key]) {
               $(el.target).before('<p class="additional-info" style="top:'+ (position.top - 35) + 'px; left:' + (position.left + 25) + 'px">' +additionalInfo[key]+ '</p>'); 
            }
        }, 
        mouseleave: (el) => {
            $(el.target).siblings('.additional-info').remove();
        }
    });


    // ADD-ONS
    
    // change textareas to richtext fields
    $('.richtext').richText();

    // add search bar to the select dropdown
    $(".select-with-search").select2( {
        placeholder: "Select",
        allowClear: true
    } );


    // optional functionality (can be removed if needed) - dynamic styling of the sections

    // style border for preferred names and identities
    $( "fieldset:has(input[name*='preferred']:checked)" ).addClass('border-left');

    $('body').on('click', 'input[name*="preferred"]', (el) => {
        $(el.target).parents('fieldset').siblings().removeClass('border-left');
        if ($(el.target).is(':checked')) {
            $(el.target).parents('fieldset').first().addClass('border-left');
        }
    });

});

// change name of the duplicated field
function updateAttribute(idToIncrement, name) {
    // var regex = new RegExp('(?<='+idToIncrement + '-)[0-9]+'); lookbehind expression still doesn't work in Safari
    var regex = new RegExp('(.*'+idToIncrement + '-)([0-9]+)');
    var name = name.replace(regex, (fullMatch, n, m) => {return n+(Number(m) + 1)});
    return name;
}


// addField() might require refactoring to merge with addBlock()
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
    template.find("input[type=checkbox], input[type=radio]").prop('checked', false);

    $(el).parent().before(template);
}

// add a record section, e.g., Name entry
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
    template.find("input[type=checkbox], input[type=radio]").prop('checked', false);
    template.find( "input[name*='preferred']" ).parents('fieldset').last().removeClass('border-left');
    $(el).parent().before(template);
}



//start MODAL TEMPLATES

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

function editValue(val) {
    if(val == 'place') {
        $('main').append(`<div class="modal active" id="edit-place-form">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h2>Find place</h2>
                                    <input type="button" class="icon-only" aria-label="close" onclick="closeBlock('modal')" value="&#xf00d;" />
                                </div>
                                <div class="modal-body">
                                    <form action="" method="" id="edit-place">
                                        <div class="two-column-table">
                                            <div>
                                                <label>
                                                    <span class="required">Geoname id</span>
                                                    <input type="text" name="geoname-id"/>
                                                </label>
                                                <label><input type="checkbox" class="inline" name="update-geoname" onclick=""/>Update from geonames</label>
                                                <label>Address
                                                    <input type="text" name="address" disabled/>
                                                </label>
                                                <label>Class description
                                                    <input type="text" name="class-description" disabled/>
                                                </label>
                                                <label>Country
                                                    <input type="text" name="country" disabled/>
                                                </label>
                                            </div>
                                            <div>
                                                <label>Feature class
                                                    <input type="email" name="feature-class" disabled/>
                                                </label>
                                                <label>Latitude
                                                    <input type="email" name="latitude" disabled/>
                                                </label>
                                                <label>Longitude
                                                    <input type="email" name="longitude" disabled/>
                                                </label>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <input type="submit" value="Save" form="edit-place" class="save"/>
                                </div>
                            </div>
                        </div>`);
                        }
}


function warningModal() {
    $('main').append(`<div class="modal active">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h2>Delete this record?</h2>
                            </div>
                            <div class="modal-body">
                            </div>
                            <div class="modal-footer">
                                <input type="submit" value="Cancel" class="default"/>
                                <input type="submit" value="Delete" class="danger"/>
                            </div>
                        </div>
                    </div>`); 
}

function alertPopup(msg) {
    $('main').append(`<div class="modal active">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <input type="button" class="icon-only" aria-label="close" onclick="closeBlock('modal')" value="&#xf00d;" />
                                    </div>
                                    <div class="modal-body">
                                        <p>`+ msg +`</p>
                                    </div>
                                    <div class="modal-footer">
                                    </div>
                                </div>
                            </div>`);
}

//end MODAL TEMPLATES


// delete a field or a section on the entity page
function deleteField(el) {
    var ref = $(el).closest('.optional-to-delete').attr('data-content-reference');
    if ($(el).closest('.optional-to-delete').siblings('[data-content-reference='+ref+']').length >= 1) {
        warningModal();
        $('input[type=submit]').click((e) => {
            $('.modal').removeClass('active');
            if($(e.target).attr('value') == 'Delete') {
                $(el).closest('.optional-to-delete').remove();
            }
            return false;
        });
    }
    else {
        alertPopup('You need to have at least one element of this type to delete selected.');
    }
}

// delete an entire record (entity or archival record)
function deleteRecord(el) {
    warningModal();
    $('input[type=submit').click((e) => {
        $('.modal').removeClass('active');
        if($(e.target).attr('value') == 'Delete') {
            // DELETE RECORD
            window.location.href = "./entities.html";
        }
        return false;
    });
}

// expand/collapse entity/archival record sections
function toggleTab(el) {
    $(el).parents('.fieldset-header').siblings('.fieldset-body').toggleClass('expand');
    $(el).toggleClass('active');
}

function closeBlock(el) {
    $('.'+el).removeClass('active');
}

function login() {
    window.location.href = "./home.html";
}

function logout() {
    window.location.href = "./login.html";
}
