const React = require('react');
const Reducers = require('../wiring/reducers');
const Connect = require('react-redux').connect;
const { StackNavigator, addNavigationHelpers } = require('react-navigation');
const internals = {};

internals.connect = Connect(
    (state) => ({
        nav: state.nav
    })
);

module.exports = (store) => {

    const Scenes = require('../scenes')(store);

    if (!Scenes.routeConfig || !Scenes.initialRouteName) {
        throw new Error('Scenes must export props "routeConfig" and "initialRouteName"');
    }

    // https://reactnavigation.org/docs/navigators
    // https://reactnavigation.org/docs/navigators/stack#RouteConfigs

    // Scenes returns { routeConfig, initialRouteName }

    const AppNavigator = StackNavigator(

        Scenes.routeConfig,

        {
            // nav config
            initialRouteName: Scenes.initialRouteName
        }
    );

    class AppNavigatorClass extends React.Component {

        render() {

            const { dispatch, nav } = this.props;

            return (
                <AppNavigator
                    navigation={
                        addNavigationHelpers({
                            dispatch,
                            state: nav
                        })
                    }
                />
            );
        };
    };

    AppNavigatorClass.propTypes = {
        dispatch: React.PropTypes.any.isRequired,
        nav: React.PropTypes.any.isRequired
    };

    const appNavReducer = require('../reducers/nav')(AppNavigator);

    Reducers.inject(store, { key: 'nav', reducer: appNavReducer });

    return internals.connect(AppNavigatorClass);
};