// Export all models
module.exports = [
    { name: 'BetService', value: require( './bet' ) },
    { name: 'GroupService', value: require( './group' ) },
    { name: 'RoundService', value: require( './round' ) },
    { name: 'SpecialBetService', value: require( './specialbet' ) },
    { name: 'TeamService', value: require( './team' ) },
    { name: 'TopListService', value: require( './toplist' ) },
    { name: 'UserService', value: require( './user' ) },
    { name: 'UserGroupService', value: require( './usergroup' ) }
];
