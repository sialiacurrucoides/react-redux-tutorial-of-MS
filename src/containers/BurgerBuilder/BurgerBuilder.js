import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../store/actions/index'; //index could be omitted



export const BurgerBuilder = (props) => {
/*     constructor(props){
        super(props);
        this.state = {...}
    } */
    const [purchasing, setPurchasing] = useState(false);

    const dispatch = useDispatch();

    const ings = useSelector(state => {
        return state.burgerBuilder.ingredients;
    });
    const price = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.burgerBuilder.error);
    const isAuth = useSelector(state => state.auth.token !== null);

    const onIngredientAdded = (igName) => dispatch(actions.addIngredient(igName));
    const onIngredientRemoved = (igName) => dispatch(actions.removeIngredient(igName));
    const onInitIngredients = (useCallback(
        () => {
            dispatch(actions.initIngredients());
        },
        [dispatch]));
    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onSetAuthRedirectPath = (path) => dispatch(actions.setAuthRedirectPath(path));


    useEffect( () => {
        onInitIngredients();
    }, [onInitIngredients])


    const updatePurchaseState = (ingredients) => {
        let sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey]
        }).reduce((sum, el) => {return sum + el},0);
        //this.setState({purchaseable: sum > 0});
        return sum > 0;
    }
    
    const purchaseHandler = () => {
        if (isAuth){
            setPurchasing(true);
        } else {
            onSetAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }

    }

    const purchaseCancelHandle = () => {
        setPurchasing(false);
    }

    const purchaseContinueHandler = () => {
        onInitPurchase();
        props.history.push('/checkout');
    }

        
    const disabledInfo = {
        ...ings
    }
    for (let key in disabledInfo){
        disabledInfo[key] = disabledInfo[key] <= 0
    }
    let orderSummary = null;
/*         if (this.state.loading){
        orderSummary = <Spinner></Spinner>;
    } */
    let burger = error ? <p>Ingredients can't be loaded!</p> :<Spinner></Spinner>;
    if (ings){
        burger = <Aux>
        <Burger ingredients={ings}/>
        <BuildControls 
        ingredientAdded={onIngredientAdded}
        ingredientRemoved={onIngredientRemoved}
        disabled={disabledInfo}
        purchaseable={updatePurchaseState(ings)}
        ordered={purchaseHandler}
        isAuth={isAuth}
        price={price}></BuildControls>
        </Aux>;
        orderSummary = <OrderSummary 
        purchaseCanceled={purchaseCancelHandle}
        purchaseContinued={purchaseContinueHandler}
        price={price.toFixed(2)}
        ingredients={ings}></OrderSummary>;
    }

    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandle}>
            {orderSummary}
            </Modal>
            {burger}
        </Aux>
    );

}


export default withErrorHandler(BurgerBuilder, axios);