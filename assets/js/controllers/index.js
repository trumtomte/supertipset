// Export all controllers
module.exports = [
    { name: 'GroupCtrl', value: require( './group' ) },
    { name: 'GroupsCtrl', value: require( './groups' ) },
    { name: 'GroupManagerCtrl', value: require( './group-manager' ) },
    { name: 'BetsCtrl', value: require( './bets' ) },
    { name: 'ProfileCtrl', value: require( './profile' ) },
    { name: 'TopListCtrl', value: require( './toplist' ) },
    { name: 'NavCtrl', value: require( './nav' ) }
];
