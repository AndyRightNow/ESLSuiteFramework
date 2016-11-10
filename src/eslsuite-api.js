module.exports = {
    //-------------------------------------
    //  APIs of Pop-out window widget
    //-------------------------------------
    PopOutWindow: {
        //  Private member variable that indicates the rebind signal
        _rebindState: false,
        //-----------------------------------------------------------------
        //  Private member function that changes the rebind signal
        //---------------------------------------------------------------
        _changeRebindState: function (state) {
            ESLSuiteAPI.PopOutWindow._rebindState = state;
        },

        //----------------------------------------------------------------------
        //  Public member function that sends rebind signal to the widget code
        //----------------------------------------------------------------------
        rebindElements: function () {
            ESLSuiteAPI.PopOutWindow._changeRebindState(true);
        }
    }
};