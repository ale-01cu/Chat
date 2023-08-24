import {configureStore} from '@reduxjs/toolkit'
import tokensSlice from './tokensSlice.js'

export const store = configureStore({
    reducer: {
        tokens: tokensSlice
    }
})