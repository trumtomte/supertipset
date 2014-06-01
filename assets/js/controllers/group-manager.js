angular.module( 'supertipset.controllers' ).controller( 'GroupManagerCtrl', ['$scope', '$location', 'ngNotify', 'ngDialog', 'api', function( $scope, $location, notify, dialog, api ) {
    $scope.message = '';

    // Set default choice for a new admin
    if ( $scope.group ) {
        $scope.newAdmin = $scope.group.users[0];
    }

    // Remove user from a group
    $scope.leave = function( newAdmin ) {
        // Last user is leaving the group - remove it
        if ( $scope.group.users.length == 1 ) {
            api.groups.remove( $scope.group.id );
        }

        // New admin has been selected
        if ( newAdmin ) {
            api.groups.update({ id: $scope.group.id, user_id: newAdmin.id });
        }

        var success = function( result ) {
            $scope.groups.splice( $scope.groups.indexOf( $scope.group ), 1 );
            notify( 'main' ).info( 'Du har lämnat gruppen!' );
            dialog.close();
        };

        api.usergroups.remove( $scope.group.relation ).success( success );
    };

    $scope.create = function( name ) {
        if ( ! name ) {
            $scope.message = 'Fyll i ett gruppnamn';
            return;
        }

        var exists = _.find( $scope.groups, { name: name } );

        if ( exists ) {
            $scope.message = 'Gruppen finns redan';
            return;
        }

        var success = function( result ) {
            dialog.close(dialog.latestID)

            dialog.open({
                template: '/assets/templates/password.html',
                data: result.password
            });

            $location.path( '/groups/' + result.id );
        };

        var error = function( result ) {
            // Unable to create group
            $scope.message = 'Gruppen kunde inte skapas, var vänlig försök igen';
        };

        var params = {
            user_id: $scope.user.id,
            name: name
        };

        api.groups.create( params )
            .success( success )
            .error( error );
    };

    // TODO store name and password each time to it cant be resubmitted?
    var prevName, prevPassword;

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
            $scope.message = 'Du är redan med i gruppen';
            return;
        }

        // On success, close dialog and redirect to the group
        var success = function( result ) {
            console.log( result );
            dialog.close();
            $location.path( '/groups/' + result.id );
            notify( 'main' ).info( 'Du har gått med i gruppen!' );
        };

        var error = function( result ) {
            console.log( result );
            $scope.message = 'Fel kombination';
        };

        var params = {
            id: $scope.user.id,
            name: name,
            password: password
        };

        api.usergroups.create( params )
            .success( success )
            .error( error );
    };
}]);
