import { loadingConstants } from "../constants";

const initialState = {
    loading: 0
};

export const loading = (state = initialState, action) => {
    switch (action.type) {
        case loadingConstants.INCREASE:
            state.loading++;
            return {
                loading: state.loading
            };
        case loadingConstants.DECREASE:
            state.loading--;
            if(state.loading < 0)
                state.loading = 0;
            return {
                loading: state.loading
            };
        case loadingConstants.CLEAR:
            state.loading = 0;
            return {
                loading: state.loading
            };
        default:
            return state;
    }
};

export default loading;