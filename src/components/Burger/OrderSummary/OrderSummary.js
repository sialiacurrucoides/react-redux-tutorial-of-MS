import React from 'react';
import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button';

const OrderSummary = (props) => {

    //this could be a functional component
        const ingredientSummary = Object.keys(props.ingredients).map(igKey => {
            return (<li key={igKey}>
            <span style={{textTransform: 'capitalize'}}>{igKey}:</span> 
            {props.ingredients[igKey]}
            </li>)
        });
        return (<Aux>
            <h3>Your Order</h3>
            <p>A delicious burger with the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total price: {props.price}</strong></p>
            <p>Continue to Checkout?</p>
            <Button clicked={props.purchaseCanceled} btnType={"Danger"}>CANCEL</Button>
            <Button clicked={props.purchaseContinued} btnType={"Success"}>CONTINUE</Button>
        </Aux>);
    }

export default OrderSummary;