var _ = require( 'lodash' );

// Controller
function GroupManagerCtrl( $scope, $location, GroupService, UserGroupService, ngDialog, ngNotify ) {
    $scope.message = '';

    // Set default choice for a new admin
    // Choose the first user, second if the current user happens to be first
    if ( $scope.group ) {
        $scope.newAdmin = $scope.group.users[$scope.group.users[0].id == $scope.user.id ? 1 : 0];
    }

    // Remove user from a group
    $scope.leave = function( newAdmin ) {
        // Last user is leaving the group - remove it
        if ( $scope.group.users.length == 1 ) {
            GroupService.remove( $scope.group.id );
        }

        // New admin has been selected
        if ( newAdmin ) {
            GroupService.update({ id: $scope.group.id, user_id: newAdmin.id });
        }

        var success = function( result ) {
            $scope.groups.splice( $scope.groups.indexOf( $scope.group ), 1 );
            ngNotify( 'main' ).info( 'Du har lämnat ligan!' );
            ngDialog.close();
        };

        // Finally remove the user from a group
        UserGroupService.remove({ relation: $scope.group.relation, id: $scope.user.id }).success( success );
    };

    // Create a new group
    $scope.create = function( name ) {
        // Empty name
        if ( ! name ) {
            $scope.message = 'Fyll i ett liganman';
            return;
        }

        var exists = _.find( $scope.groups, { name: name } );

        // Group already exists
        if ( exists ) {
            $scope.message = 'Ligan finns redan';
            return;
        }

        var success = function( result ) {
            ngDialog.close( ngDialog.latestID );

            ngDialog.open({
                template: 'password.html',
                data: result.password
            });

            $location.path( '/groups/' + result.id );
        };

        // Unable to create group
        var error = function( result ) {
            $scope.message = 'Ligan kunde inte skapas, var vänlig försök igen';
        };

        var params = {
            user_id: $scope.user.id,
            name: name
        };

        GroupService.create( params ).success( success ).error( error );
    };

    // Add user to a group
    $scope.join = function( name, password ) {
        // Needs to fill in both fields
        if ( ! name || ! password ) {
            $scope.message = 'Fyll i båda fälten!';
            return;
        }

        var isMember = _.find( $scope.groups, { name: name } );

        // If the user is already a member of the group
        if ( isMember ) {
            $scope.message = 'Du är redan med i ligan';
            return;
        }

        // On success, close dialog and redirect to the group
        var success = function( result ) {
            ngDialog.close();
            ngNotify( 'main' ).info( 'Du har gått med i ligan!' );
            $location.path( '/groups/' + result.id );
        };

        var error = function() {
            $scope.message = 'Fel kombination av liga och lösenord';
        };

        var params = {
            id: $scope.user.id,
            name: name,
            password: password
        };

        UserGroupService.create( params ).success( success ).error( error );
    };
}

// Dependencies
GroupManagerCtrl.$inject = ['$scope', '$location', 'GroupService', 'UserGroupService', 'ngDialog', 'ngNotify'];

// Export the controller
module.exports = GroupManagerCtrl;
