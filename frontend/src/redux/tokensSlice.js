import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    username: '',
    access: '',
    refresh: '',
}

export const tokensSlice = createSlice({
    name: 'tokens',
    initialState,
    reducers: {
        addTokens: (state, action) => {
            state.access = action.payload.access
            state.refresh = action.payload.refresh
        },
        addUsername: (state, action) => {
            state.username = action.payload
        }
    }
})

export const { addTokens, addUsername } = tokensSlice.actions
export default tokensSlice.reducer