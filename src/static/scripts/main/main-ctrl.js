app.controller('mainCtrl', function ($scope, $http, $cookies) {
    $scope.title = "Jobdex";
});

function error(xhr, ajaxOptions, thrownError) {
    console.log(xhr.responseText);
}

// error code
var SUCCESS = 1;
var ERR_TAG_EXISTS = -1;
var ERR_TAG_INVALID = -2;
var ERR_TAG_DOES_NOT_EXIST = -3;
var ERR_COMPANY_EXISTS = -4;
var ERR_COMPANY_INVALID = -5;
var ERR_COMPANY_DOES_NOT_EXIST = -6;
var ERR_CARD_EXISTS = -7;
var ERR_CARD_DOES_NOT_EXIST = -8;
var ERR_DOC_EXISTS = -9;
var ERR_DOC_INVALID = -10;
var ERR_DOC_DOES_NOT_EXIST = -11;
var ERR_CONTACT_EXISTS = -12;
var ERR_CONTACT_INVALID = -13;
var ERR_CONTACT_DOES_NOT_EXIST = -14;
var ERR_TAST_EXISTS = -15;
var ERR_TASK_INVALID = -16;
var ERR_TASK_DOES_NOT_EXIST = -17;

var ERR_BAD_CREDENTIALS = -18;
var ERR_EXISTING_USER = -19;
var ERR_BAD_USERNAME = -20;
var ERR_BAD_PASSWORD = -21;
var ERR_DECK_DOES_NOT_EXIST = -22;


// Controller with all of the methods for the User Model
app.controller('UserController', function($scope, $http) {

    //This table is needed to store ids on the front end for some of the method calls to users
    //when using ng-repeat, set it to "user in userCtrl.cards", where userCtrl is the UserController alias
    var users = [{
        id: 9999
    }, {
        id: 5555
    }, {
        id: 3333
    }];

    // Send information on a new user to the backend and verify information
    $scope.sign_up = function(){
        
        var req = JSON.stringify({username: $scope.user.username, password: $scope.user.password, confirm_password: $scope.user.confirm_password, email: $scope.user.email});
        
        $http.post('/sign_up', req).
            success(function(data, status, headers, config) {
                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    //Store the user id in the table above
                    users.push(data.user_id_output);

                    // direct user to the dashboard in html
                }
            }).error(function(data, status, headers, config) {
                //add error handling function
        });

        $scope.user = {};
    };

    $scope.validEmail = function(){
        if ($scope.email == null){
            return false;
        }
        else{
            return true;
        }
    };

    //Verify a user's login info
    $scope.login = function(){

        var req = JSON.stringify({username: $scope.user.username, password: $scope.user.password});
        
        $http.post('/api/users', req).
            success(function(data, status, headers, config) {
                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    // sucess
                }
            }).error(function(data, status, headers, config) {
                //add error handling function
        });

        $scope.user = {};
    };

    //Once logout is selected, user should be brought back to the login page
    $scope.logout = function(){

        $http.get('/api/users').
            success(function(data, status, headers, config) {
                //add success result
                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    // sucess 
                }
            }).error(function(data, status, headers, config) {
                //add error handling function
        });

        $scope.user = {};
        //Add navigation for HTML
        //Save cookies to the backend
    };

    //Return a List of all of the cards for a user
    $scope.get_user_cards = function(user){

        $http.get('/api/users/' + user.id + '/cards').
            success(function(data, status, headers, config) {
                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    // in the html, use cardList to display company cards
                    $scope.cardList = data.cards_output;
                }
            }).error(function(data, status, headers, config){

        });
    };

    //Return a List of all of the cards from a certain company, when given the company name
    $scope.get_company_cards = function(user){

        $http.get('/api/users/' + user.id + '/' + company_name + '/cards').
            success(function(data, status, headers, config) {

                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    // in the html, use cardList to display company cards
                    $scope.cardList = data.cards_output;
                }

            }).error(function(data, status, headers, config){

        });
    };

    $scope.errorHandler = function(error_message) {
        if (error_message == ERR_BAD_CREDENTIALS){
            console.log("Bad Credential");
        }
        else if (error_message == ERR_EXISTING_USER){
            console.log("User Exists");
        }
        else if (error_message == ERR_BAD_USERNAME){
            console.log("Bad Username");
        } 
        else if (error_message == ERR_BAD_PASSWORD){
            console.log("BAD_PASSWORD");
        }
    };


});


//All methods dealing with cards are in this controller
app.controller('CardController', function($scope, $http){

    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

    $scope.loadDescription = function(companyName) {
        var id = "27457";
        var key = "hLRrzOCPdlc";
        var url = "http://api.glassdoor.com/api/api.htm?t.p="+id+"&t.k="+key+"&userip=0.0.0.0&useragent=&format=json&v=1&action=employers&q="+companyName;
        $http.get(url, {})
            .success(function(data, status, headers, config){
                var description = data.response.employers[0];
                $('#glassdoor-description').text('hi');
            })
            .error(function(data, status, headers, config){
                console.log(data);
        });
    }

    var id_table = [];
    var deck_id_table = [];

    $scope.showDeckForm = false;
    $scope.create_deck_helper = function(){
        $('#new-deck').css({
            'visibility': 'visible',
        });
        $scope.showDeckForm = true;

    }

    $scope.deckExists = false;
    $scope.create_deck = function(){

        var req = JSON.stringify({companyName: $scope.deck.companyName, 
            companyDescription: $scope.deck.companyDescription});

        $http.post('/api/user/create-deck/', req).
            success(function(data, status, headers, config){
                console.log(data);

                if (data.error_message == -23) {
                    $('.deck-exists').css({
                        'visibility': 'visible',
                    });
                    $scope.deckExists = true;
                    $scope.showDeckForm = false;
                }

                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    deck_id_table.push(data.deck_id);
                }

            location.reload();

            }).error(function(data, status, headers, config){
                console.log(data);
            });

        $scope.deck = {};
    };

    $scope.addDocument = function() {
        var card_id = $scope.displayedCard.id;
        var doc = $scope.documentAdded.trim();
        var req = JSON.stringify({card_id: card_id, document: doc});

        $http.post('/api/card/add-document/', req).
            success(function(data, status, headers, config){
                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    location.reload();
                }
            }).error(function(data, status, headers, config){
                console.log(data);
            });
    }

    $scope.$watch('tagFilter', function() {
        var tag = $scope.tagFilter; 
        $('.card-detail-btn').each(function() {
            if (tag && $(this).data('tags').indexOf(tag) !== -1) {
                $(this).css({
                    'border': '3px solid #FFD700',
                });
            } else {
                $(this).css({
                    'border': 'none',
                });
            }
        });
    }, true);

    $scope.add_tag = function(){
        var card_id = $scope.displayedCard.id;
        var tags = $scope.new_tags
        var req = JSON.stringify({card_id: card_id, tags: tags});

        $http.post('/api/card/add-tag/', req).
            success(function(data, status, headers, config){
                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    location.reload();
                }
            }).error(function(data, status, headers, config){
                console.log(data);
            });
    };

    $scope.selectedTag = "";

    $scope.isEditingTag = function(tagName) {
        if (tagName == $scope.selectedTag) {
            return true;
        }
        return false;
    }

    $scope.editTag = function(tagName) {
        $scope.selectedTag = tagName;
    }
    $scope.changeTag = function(oldTag, newTag){
        var cardId = $scope.displayedCard.id;

        var req = {card_id: cardId, tag_to_replace: oldTag, new_tag: newTag};
        console.log(oldTag);

        $http.post('/api/card/edit-tag/', req).
            success(function(data, status, headers, config){
                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    //$scope.tags.splice($scope.currentTagIndex, 1);
                    //$scope.tags.push(newTag);
                    location.reload(true);
                }

            }).error(function(data, status, headers, config){
                console.log(data);
            });

    };

    $scope.get_tags = function(cardID){

        $http.get('/api/card/' + card_ID + '/tags').
            success(function(data, status, headers, config){
                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    $scope.tags = data.tags;
                    // in html, inside the CardController, use 'tags' to refer to the return tags
                    location.reload();
                }
            }).error(function(data, status, headers, config){
             //Handle error
        });

    };

    // remove the tag given cardID and tagName
    $scope.removeTag = function(tag){
        //$scope.tagIndex = $scope.tags.indexOf(tagName);
        var card_id = $scope.displayedCard.id;
        var old_tag = tag.trim();

        var req = JSON.stringify({card_id: card_id, target_tag: old_tag});
        
        $http.post('/api/card/remove-tag/', req).
            success(function(data, status, headers, config){
                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    location.reload();
                }
            }).error(function(data, status, headers, config){
            //Handle error
        });
    };


    $scope.displayedCard = {};
    $scope.displayedCard.contactList = [];
    $scope.detailIsShown = false;
    $scope.todos = [
    {text:'Learn AngularJS', done:false},         
    {text: 'Build an app', done:false}
    ];
    $scope.isEditing = false;
    $scope.isStatusEditing = false;
    $scope.isContactEditing = false;
    $scope.isContactAdding = false;
    $scope.isNotesEditing= false;
    $scope.isTagAdding= false;
    $scope.isTagRemoving= false;
    $scope.edit = function() {
       if ($scope.isEditing){
            $scope.isEditing = false;
        }
        else{
           $scope.isEditing = true;
        }
    }
    $scope.editStatus = function() {
       if ($scope.isStatusEditing){
            $scope.isStatusEditing = false;
        }
        else{
           $scope.isStatusEditing = true;
        }
    }

    $scope.editAddContact = function() {
       if ($scope.isContactAdding){
            $scope.isContactAdding = false;
        }
        else{
           $scope.isContactAdding = true;
        }
    }
    $scope.editNotes = function() {
       if ($scope.isNotesEditing){
            $scope.isNotesEditing= false;
        }
        else{
           $scope.isNotesEditing = true;
        }
    }
    $scope.editAddTags = function() {
       if ($scope.isTagAdding){
            $scope.isTagAdding= false;
        }
        else{
           $scope.isTagAdding = true;
        }
    }
    $scope.editRemoveTags = function() {
       if ($scope.isTagRemoving){
            $scope.isTagRemoving= false;
        }
        else{
           $scope.isTagRemoving = true;
        }
    }
    $scope.closeEdit = function() {
       $scope.isEditing = false;
       $scope.isNotesEditing= false;
       $scope.isTagAdding= false;
       $scope.isTagRemoving= false;
       $scope.isStatusEditing = false;
    }
    $scope.closeDetails = function() {
        $scope.detailIsShown = false;
    }

    $scope.blah = function(x) {
        console.log(x);
    }

    $scope.showDetails = function(card) {
        $('#card-detail').css({
            'visibility': 'visible',
        });
        $scope.displayedCard.company = $(angular.element(card)[0]).data('company');
        $scope.displayedCard.position = $(angular.element(card)[0]).data('position');
        $scope.displayedCard.notes = $(angular.element(card)[0]).data('notes');
        if ($(angular.element(card)[0]).data('documents').length > 0) {
            $scope.displayedCard.documents = $(angular.element(card)[0]).data('documents').split(",");
        } else {
            $scope.displayedCard.documents = "";
        }
        $scope.displayedCard.documenturls = $(angular.element(card)[0]).data('documenturls').split(",");
        $scope.displayedCard.contacts = $(angular.element(card)[0]).data('contacts').split(",");
        $scope.displayedCard.contactName = $scope.displayedCard.contacts[0];
        $scope.displayedCard.contactEmail = $scope.displayedCard.contacts[1];
        $scope.displayedCard.contactPhone = $scope.displayedCard.contacts[2];
        var status = $(angular.element(card)[0]).data('status');
        if (status == "inprogress") {
            $scope.displayedCard.status = "In Progress";
        } else if (status == "offered") {
            $scope.displayedCard.status = "Offer Receieved";
        } else {
            $scope.displayedCard.status = status;
        } 
        $scope.displayedCard.id = $(angular.element(card)[0]).data('card_id');
        if ($(angular.element(card)[0]).data('tasks').length > 0) {
            $scope.displayedCard.tasks = $(angular.element(card)[0]).data('tasks').split(",");
        } else {
            $scope.displayedCard.tasks = "";
        }
        if ($(angular.element(card)[0]).data('tags').length > 0) {
            $scope.displayedCard.tags = $(angular.element(card)[0]).data('tags').split(",");
        } else {
            $scope.displayedCard.tags = "";
        }
        $scope.detailIsShown = true;
        var contactObj = {};
        $scope.displayedCard.contactList = [];
        $scope.displayedCard.documentList = [];
        for (var i = 0; i < $scope.displayedCard.documents.length; i++) {
            var docObj = {};
            docObj.name = $scope.displayedCard.documents[i].trim();
            docObj.url = $scope.displayedCard.documenturls[i].trim();
            $scope.displayedCard.documentList.push(docObj);
        }
        for (var i = 0; i < $scope.displayedCard.contacts.length; i+=3){

            contactObj.name = $scope.displayedCard.contacts[i];
            contactObj.email = $scope.displayedCard.contacts[i+1];
            contactObj.phone = $scope.displayedCard.contacts[i+2];

            $scope.displayedCard.contactList.push(contactObj);
            contactObj = {};
        }

        for (var i = 0; i < $scope.displayedCard.tags.length; i++){
            $scope.displayedCard.tags[i] = $scope.displayedCard.tags[i].substring($scope.displayedCard.tags[i].indexOf(":") + 1);
            $scope.displayedCard.tags[i] = $scope.displayedCard.tags[i].slice(">", -1);
            if (i == $scope.displayedCard.tags.length - 1){
                $scope.displayedCard.tags[i] = $scope.displayedCard.tags[i].slice(">", -1);
            }
        }

        for (var i = 0; i < $scope.displayedCard.tasks.length; i++){
            $scope.displayedCard.tasks[i] = $scope.displayedCard.tasks[i].substring($scope.displayedCard.tasks[i].indexOf(":") + 1);
            $scope.displayedCard.tasks[i] = $scope.displayedCard.tasks[i].slice(">", -1);
            if (i == $scope.displayedCard.tasks.length - 1){
                $scope.displayedCard.tasks[i] = $scope.displayedCard.tasks[i].slice(">", -1);
            }
        }

    };

    $scope.showCardForm = false;
    $scope.displayedDeck = {};
    $scope.add_card_helper = function(deck) {
        $('#menu-items').css({
            'visibility': 'visible',
        });
        $scope.displayedDeck.deckID = $(angular.element(deck)[0]).data('deck-id');
        $scope.showCardForm = true;
    };

    $scope.add_card = function() {
        $scope.showCardForm = false;
        console.log($scope.displayedDeck.deckID);
        var req = JSON.stringify({deck_id: $scope.displayedDeck.deckID,
            jobTitle: $scope.card.position,
            tags: $scope.card.tags,
            notes: $scope.card.notes,
            contactName: $scope.card.contactName,
            contactEmail: $scope.card.contactEmail,
            contactPhone: $scope.card.contactPhone,
            status: $scope.card.status});

        console.log(req);

        $http.post('/api/card/add-card/', req).
            success(function(data, status, headers, config){

                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    location.reload();
                }


            }).error(function(data, status, headers, config){
                console.log(data);
            });

        $scope.card = {};

    };

    $scope.delete_deck = function(deck){
        var deckID = $(angular.element(deck)[0]).data('unique_id');
        var req = {deck_id: deckID};

        $http.post('/api/user/delete-deck/', req).
            success(function(data, status, headers, config){
                if (data.error_message <= 0) {
                    error(data)
                }
                else if (data.error_message == 1) {
                    location.reload(true);
                }
            }).error(function(data, status, headers, config){
                console.log(data);
            });
    };

    //remove card given user and card_id
    $scope.remove_card = function(card){
        var req = {card_id: $scope.displayedCard.id};

        $http.post('/api/user/remove-card/', req).
            success(function(data, status, headers, config){
                if (data.error_message <= 0) {
                    error(data)
                }
                else if (data.error_message == 1) {
                    location.reload(true);
                }
            }).error(function(data, status, headers, config){
                console.log(data);
        });
    };

    //Change the status of a card (In Progress, Complete, Failed, or Interested)
    $scope.changeStatus = function(){
        var cardId = $scope.displayedCard.id;
        var newStatus = $scope.newStatus;

        var req = {card_id: cardId, new_status: newStatus};

        $http.post('/api/card/modify-card-status/', req).
            success(function(data, status, headers, config) {

                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    // change the card status in the html
                    location.reload(true);
                }

            }).error(function(data, status, headers, config) {
                console.log(data);
        });     
    };

    $scope.add_contact = function(cardID){
        var card_id = $scope.displayedCard.id;
        var add_name = $scope.add_name;
        var add_email = $scope.add_email;
        var add_phone = $scope.add_phone;

        var req = JSON.stringify(
            {card_id: card_id, 
            add_name: add_name, 
            add_email: add_email,
            add_phone: add_phone,
        });

        $http.post('/api/card/add-contact/', req).
            success(function(data, status, headers, config){

                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    location.reload();
                }


            }).error(function(data, status, headers, config){
                console.log(data);
        });
    };



    $scope.add_task = function(){
        var card_id = $scope.displayedCard.id;
        var new_task = $scope.new_task;

        var req = JSON.stringify({card_id: card_id,
            new_task: new_task});

        $http.post('/api/card/add-task/', req).
            success(function(data, status, headers, config){

                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    location.reload();
                }


            }).error(function(data, status, headers, config){
                console.log(data);
        });
    };

    $scope.edit_notes = function() {
        var card_id = $scope.displayedCard.id;
        var new_notes = $scope.new_notes;
        if (new_notes == null) {
            new_notes = " ";
        }
        var req = {card_id: card_id, new_notes: new_notes}

        $http.post('/api/card/edit-notes/', req).
            success(function(data, status, headers, config) {

                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    // change the card status in the html
                    location.reload(true);
                }

            }).error(function(data, status, headers, config) {
                console.log(data);
        });
    }

//Edit Contact
    $scope.editContact = function(contact, contactName, contactEmail, contactPhone) {
        $scope.isContactEditing = true;
        $scope.selectedContact = contact;
        $scope.selectedContactName = contactName.trim();
        $scope.selectedContactEmail = contactEmail.trim();
        $scope.selectedContactPhone = contactPhone.trim();
    }
    $scope.closeEditContact = function(){
        $scope.isContactEditing = false;
        $scope.selectedContact = null;
    }
    //edit contact given newName, newEmail, newPhone, and oldName
    $scope.change_contact = function(newName, newEmail, newPhone, oldName) {
        var card_id = $scope.displayedCard.id;

        var req = {card_id: card_id, new_name: newName, new_email: newEmail, new_phone: newPhone, current_name: oldName.trim()};
        $http.post('/api/card/edit-contact/', req).
            success(function(data, status, headers, config) {

                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    $scope.closeEditContact();
                    location.reload(true);
                }

            }).error(function(data, status, headers, config) {
                console.log(data); 
        });     
    };

    //remove a contact given card_id and contact.name
    $scope.removeContact = function(name){
        var cardId = $scope.displayedCard.id;
        var req = JSON.stringify({card_id: cardId, contactName: name.trim()});

        $http.post('/api/card/remove-contact/', req).
            success(function(data, status, headers, config){
                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message)
                }
                else if (data.error_message == 1) {
                    location.reload(true);
                }
            }).error(function(data, status, headers, config){

        });
    };

    $scope.get_contacts = function(cardID){

        $http.get('/api/card/' + card_ID + '/contacts').
            success(function(data, status, headers, config){
                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    $scope.contacts = data.contacts_output;
                    // in html, inside the CardController, use 'contacts' to refer to the return contacts
                }
            }).error(function(data, status, headers, config){
             //Handle error
        });

    };


    $scope.errorHandler = function(error_message) {
        if (error_message == ERR_TAG_EXISTS){
            console.log("$scope card already contains $scope tag.");
        }
        else if (error_message == ERR_TAG_INVALID){
            console.log("Please make sure your tag is less than 128 characters.");
        }
        else if (error_message == ERR_TAG_DOES_NOT_EXIST){
            console.log("The tag you are searching for does not extist.");
        } 
        else if (error_message == ERR_COMPANY_EXISTS){
            console.log("The company you are trying to create already exists.");
        }
        else if (error_message == ERR_COMPANY_INVALID){
            console.log("Please make sure your Company name is valid and under 128 characters.");
        }
        else if (error_message == ERR_COMPANY_DOES_NOT_EXIST){
            console.log("The company does not exist.");
        }
        else if (error_message == ERR_CARD_EXISTS){
            console.log("The card already exist.");
        }
        else if (error_message == ERR_CARD_DOES_NOT_EXIST){
            console.log("The card does not exist.");
        }
        else if (error_message == ERR_CONTACT_EXISTS){
            console.log("The contact already exist.");
        }
        else if (error_message == ERR_CONTACT_INVALID){
            console.log("Please make sure the contact you create is valid.");
        }
        else if (error_message == ERR_CONTACT_DOES_NOT_EXIST){
            console.log("The contact does not exist.");
        }
        else if (error_message == ERR_TASK_EXISTS){
            console.log("The task already exist.");
        }
        else if(error_message == ERR_TASK_INVALID){
            console.log("Please make sure the task you create is valid.");
        }
        else if (error_message == ERR_TASK_DOES_NOT_EXIST) {
            console.log("The task does not exist.");
        }
    };

});


// app.service('pdf_upload', ['$http', function ($http) {

//     this.uploadPdf = function(file, uploadUrl){
//         var formdata = new FormData();
//         formdata.append('file', file);
        
//         $http.post(uploadUrl, formdata, {
//                 transformRequest: angular.identity,
//                 headers: {'Content-Type': undefined}
//             }).success(function(){

//             }).error(function(){
            
//             });
// }}]);

app.controller('DocumentController', function($scope, $http) {
    $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

    //Upload a PDF doc to the backend database for storage
    //$scope.upload_document = function(){
    //
    //    var req = JSON.stringify({name: $scope.doc.name, pdf: $scope.file});
    //
    //    //pdf_upload.uploadPdf($scope.doc.PDFdoc, '/api/user/upload_document/')

    //    $http.post('/api/user/upload_document/', req).
    //        success(function(data, status, headers, config) {
    //            if (data.error_message <= 0) {
    //                $scope.errorHandler(data.error_message);
    //            }
    //            else if (data.error_message == 1){
    //                location.reload(true);
    //            }
    //        }).error(function(data, status, headers, config){

    //    });

    //    $scope.doc = {};
    //};
    $scope.showDocument = function(doc) {
        var docURL = $(angular.element(doc)[0]).data('url');
        window.location.href = "/static/web/viewer.html?file=" + docURL;
    }

    $scope.deleteDocument = function(doc){

        var req = JSON.stringify({doc_id: $(angular.element(doc)[0]).data('id')});

        $http.post('/api/document/delete/', req).
            success(function(data, status, headers, config) {
                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    location.reload();
                }
            }).error(function(data, status, headers, config){
                console.log(data);
        });
    };

    $scope.get_documents = function(userID){

        var req = JSON.stringify({user_id: userID});
        
        $http.get('/api/users/' + userID + '/documents', req).
            success(function(data, status, headers, config) {
                if (data.error_message <= 0) {
                    $scope.errorHandler(data.error_message);
                }
                else if (data.error_message == 1){
                    $scope.documents = data.documents_output;
                }
            }).error(function(data, status, headers, config){

         });
    };


    $scope.errorHandler = function(error_message) {

        if (error_message == ERR_DOC_EXISTS){
            console.log("Document already exist");
        }
        else if (error_message == ERR_DOC_INVALID){
            console.log("Please make sure the document is valid.");
        }
        else if (error_message == ERR_DOC_DOES_NOT_EXIST) {
            console.log("The document does not exist.");
        }
    };  
});
