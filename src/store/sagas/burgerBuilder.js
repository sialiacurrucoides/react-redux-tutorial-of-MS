import { put } from 'redux-saga/effects';
import * as actions from '../actions/index';
import axios from 'axios';
import {FIREBASE_INGREDIENTS} from '../../env';

export function* initIngredientsSaga(){
    try{
        const response = yield axios.get(FIREBASE_INGREDIENTS);
        yield put(actions.setIngredients(response.data));
    } catch (error){
        yield put(actions.fetchIngredientsFailed());
    }  
}