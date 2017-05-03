// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();

    // Username link click
    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    // Edit user button click
    $('#userList table tbody').on('click', 'td a.linkedituser', showEditUserInfo);

    // Add user button click
    $('#btnAddUser').on('click', addUser);

    // Delete User link click
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/userlist', function( data ) {

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
          userListData = data;
          tableContent += '<tr>';
          tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
          tableContent += '<td>' + this.email + '</td>';
          tableContent += '<td><a href="#" class="linkedituser" rel="' + this._id + '">edit</a></td>';
          tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
          tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#userList table tbody').html(tableContent);
    });
};

// Show User info
function showUserInfo(event){

  // Prevent link from firing
  event.preventDefault();

  // Retrieve username from link rel attribute
  var thisUserName = $(this).attr('rel');

  // Get index of object based on id value
  var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

  // Get our user object
  var thisUserObject = userListData[arrayPosition];

  // Populate Info box
  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoGender').text(thisUserObject.gender);
  $('#userInfoLocation').text(thisUserObject.location);

};

// Show Edit User info
function showEditUserInfo(event) {

  // Prevent link from firing
  event.preventDefault();

  var thisUserId = $(this).attr('rel');

  var arrayPosition = userListData.map(function(arrayItem) { return arrayItem["_id"]; }).indexOf(thisUserId);
  // Get our user object
  var thisUserObject = userListData[arrayPosition];

  // Populate Edit Form
  $('#editUserName').val(thisUserObject.username);
  $('#editUserEmail').val(thisUserObject.email);
  $('#editUserFullname').val(thisUserObject.fullname);
  $('#editUserAge').val(thisUserObject.age);
  $('#editUserLocation').val(thisUserObject.location);
  $('#editUserGender').val(thisUserObject.gender);

  function editSubmitUser(){

    var updatedUser = {
      'username': $('#editUserName').val(),
      'email': $('#editUserEmail').val(),
      'fullname': $('#editUserFullname').val(),
      'age': $('#editUserAge').val(),
      'location': $('#editUserLocation').val(),
      'gender': $('#editUserGender').val()
    }

    $.ajax({
      type: 'PUT',
      url: '/users/edituser/' + thisUserId,
      data: updatedUser
    }).done(function(response){
      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#addUser fieldset input').val('');

        // Update the table
        populateTable();

      }
      else {
        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);
      }
    });
  }

  $('#btnEditUser').on('click', editSubmitUser);

}

// Add User
function addUser(event) {
  event.preventDefault();

  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  $('#addUser input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  // Check to make sure errorCount's still at zero
  if(errorCount === 0) {

    //If it is, compile all user info into one object
    var newUser = {
      'username': $('#addUser fieldset input#inputUserName').val(),
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'fullname': $('#addUser fieldset input#inputUserFullname').val(),
      'age': $('#addUser fieldset input#inputUserAge').val(),
      'location': $('#addUser fieldset input#inputUserLocation').val(),
      'gender': $('#addUser fieldset input#inputUserGender').val()
    }

    // Use AJAX to post the object to our adduser service
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function(response){

      // Check for successful (blank) response
      if (response.msg === '') {

        // Clear the form inputs
        $('#addUser fieldset input').val('');

        // Update the table
        populateTable();

      }
      else {
        // If something goes wrong, alert the error message that our service returned
        alert('Error: ' + response.msg);
      }

    });

  }
  else {

    // If errorCount is more than 0, error out
    alert('Please fill in all fields');
    return false;

  }

};

function deleteUser(event) {

  event.preventDefault();

  // Pop up a confirmation dialog
  var confirmation = confirm('Are you sure you want to delete this user?');

  // Check to make sure the user confirmed
  if (confirmation === true) {

    //If they did, do our delete
    $.ajax({
      type: 'DELETE',
      url: '/users/deleteuser/' + $(this).attr('rel')
    }).done(function( response ){

      // Check for a successful (blank) response
      if (response.msg === '') {

      }
      else {
        alert('Error: ' + response.msg);
      }

      // Update the table
      populateTable();

    });

  }
  else {

    // If they said no to the confirm, do nothing
    return false;

  }

};
