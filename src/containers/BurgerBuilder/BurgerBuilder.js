import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index'; //index could be omitted



export class BurgerBuilder extends Component {
/*     constructor(props){
        super(props);
        this.state = {...}
    } */
    state = {
        purchasing: false
    }

    componentDidMount(){
        this.props.onInitIngredients();
    }

    updatePurchaseState(ingredients){
        let sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey]
        }).reduce((sum, el) => {return sum + el},0);
        //this.setState({purchaseable: sum > 0});
        return sum > 0;
    }


    
    purchaseHandler = () => {
        if (this.props.isAuth){
            this.setState({purchasing: true});
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }

    }

    purchaseCancelHandle = () => {
        this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
        this.props.history.push('/checkout');
    }


    render () {
        
        const disabledInfo = {
            ...this.props.ing
        }
        for (let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
/*         if (this.state.loading){
            orderSummary = <Spinner></Spinner>;
        } */
        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> :<Spinner></Spinner>;
        if (this.props.ing){
            burger = <Aux>
            <Burger ingredients={this.props.ing}/>
            <BuildControls 
            ingredientAdded={this.props.onIngredientAdded}
            ingredientRemoved={this.props.onIngredientRemoved}
            disabled={disabledInfo}
            purchaseable={this.updatePurchaseState(this.props.ing)}
            ordered={this.purchaseHandler}
            isAuth={this.props.isAuth}
            price={this.props.price}></BuildControls>
            </Aux>;
            orderSummary = <OrderSummary 
            purchaseCanceled={this.purchaseCancelHandle}
            purchaseContinued={this.purchaseContinueHandler}
            price={this.props.price.toFixed(2)}
            ingredients={this.props.ing}></OrderSummary>;
        }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandle}>
                {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ing: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuth: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (igName) => dispatch(actions.addIngredient(igName)),
        onIngredientRemoved: (igName) => dispatch(actions.removeIngredient(igName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));