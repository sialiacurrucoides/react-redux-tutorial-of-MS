import React from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import {Route, Redirect} from 'react-router-dom';
import ContactData from '../Checkout/ContactData/ContactData';
import { connect } from 'react-redux';
import Aux from '../../hoc/Aux/Aux';


const Checkout = (props) => {


    const checkoutCancelledHandler = () => {
        props.history.goBack();
    }
    const checkoutContinuedHandler = () => {
        props.history.replace('/checkout/contact-data')
    }

    let summary = (<Redirect to='/'/>);
    
    if (props.ing){
        const purchasedRedirect = props.purchased ? <Redirect to="/" /> : null;
        summary = (<Aux>             
                <CheckoutSummary 
                ingredients={props.ing} 
                checkoutCanceled={checkoutCancelledHandler}
                checkoutContinued={checkoutContinuedHandler}
                />
                <Route path={props.match.path + '/contact-data'} 
                    component={ContactData}
                />
                {purchasedRedirect}
            </Aux>);
    }
    return summary;
}

const mapStateToProps = state => {
    return {
        ing: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
};


export default connect(mapStateToProps)(Checkout);