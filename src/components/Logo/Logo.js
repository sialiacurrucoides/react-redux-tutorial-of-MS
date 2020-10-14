import React from 'react';
import burgerLogo from '../../assets/images/burger-logo.png';
import classes from './Logo.module.css';
import { checkPropTypes } from 'prop-types';
import {Link} from 'react-router-dom';

const logo = () => (
    <div className={classes.Logo} style={{height: checkPropTypes.height}}>
        <Link to='/'><img src={burgerLogo} alt="MyBurger"></img></Link>
    </div>
);

export default logo;